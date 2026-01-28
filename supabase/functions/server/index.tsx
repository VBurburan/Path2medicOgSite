import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8ae44dd2/health", (c) => {
  return c.json({ status: "ok" });
});

// Make admin endpoint
app.post("/make-server-8ae44dd2/make-admin", async (c) => {
  try {
    const { email, secretCode } = await c.req.json();

    // Verify secret code
    if (secretCode !== 'path2medic-admin-2024') {
      return c.json({ error: 'Invalid secret code' }, 401);
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    const user = userData.users.find((u: any) => u.email === email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update user metadata to set admin role
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin'
        }
      }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      return c.json({ error: 'Failed to update user' }, 500);
    }

    return c.json({ 
      success: true, 
      message: 'User promoted to admin successfully',
      userId: user.id 
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Signup endpoint
app.post("/make-server-8ae44dd2/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Validate input
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: 'client' 
      },
      email_confirm: true // Automatically confirm since email server isn't configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message || 'Failed to create user' }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'User created successfully',
      userId: data.user.id 
    });
  } catch (error) {
    console.error('Server error during signup:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);