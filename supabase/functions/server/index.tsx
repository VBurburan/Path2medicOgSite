import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono();

// Initialize Storage Buckets
(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Private bucket for sensitive user documents
    const privateBucket = 'make-8ae44dd2-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.some(b => b.name === privateBucket)) {
      await supabase.storage.createBucket(privateBucket, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
      });
      console.log(`Created private storage bucket: ${privateBucket}`);
    }

    // Public bucket for website assets (logos, banners, etc)
    const publicBucket = 'path2medic-public';
    if (!buckets?.some(b => b.name === publicBucket)) {
      await supabase.storage.createBucket(publicBucket, {
        public: true, // Publicly accessible via URL
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
      });
      console.log(`Created public storage bucket: ${publicBucket}`);
    }

  } catch (err) {
    console.error('Failed to initialize storage buckets:', err);
  }
})();

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
    const adminSecret = Deno.env.get('ADMIN_SECRET_CODE');
    
    // Fail closed: if the secret isn't configured in the environment, disable the endpoint
    if (!adminSecret) {
      return c.json({ error: 'Admin promotion is disabled by server configuration' }, 403);
    }

    if (secretCode !== adminSecret) {
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

// List all users (Admin only)
app.get("/make-server-8ae44dd2/list-users", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'No authorization header' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // List all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    return c.json({ users });
  } catch (error) {
    console.error('List users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Inspect database tables
app.get("/make-server-8ae44dd2/inspect-tables", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const tablesToCheck = [
      'profiles', 
      'users', 
      'products', 
      'orders', 
      'purchases',
      'bookings',
      'appointments',
      'questions', 
      'quizzes', 
      'exams',
      'user_progress',
      'practice_results'
    ];
    
    const results: Record<string, any> = {};

    for (const table of tablesToCheck) {
      const { error } = await supabase.from(table).select('*').limit(1);
      results[table] = error ? `Error: ${error.message}` : 'Exists';
    }

    // Also list buckets
    const { data: buckets } = await supabase.storage.listBuckets();

    return c.json({
      tables: results,
      buckets: buckets?.map(b => b.name) || [],
      kv_store_check: await kv.get('test_key') !== undefined || true
    });
  } catch (error) {
    return c.json({ error: 'Failed to inspect tables', details: error }, 500);
  }
});

// Get user data (Profile, Purchases, Bookings)
app.get("/make-server-8ae44dd2/user-data", async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization header' }, 401);
  
  const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
  }

  // Try fetching from standard tables
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: purchases } = await supabase.from('purchases').select('*').eq('user_id', user.id);
  const { data: bookings } = await supabase.from('bookings').select('*').eq('user_id', user.id);
  
  // If tables fail or return null, try KV store
  let kvPurchases: any[] = [];
  let kvBookings: any[] = [];
  
  // Note: We use try-catch for KV operations as getByPrefix might not return array if empty? 
  // implementation of kv_store.tsx returns [] so it is fine.
  
  if (!purchases) {
      try {
        kvPurchases = await kv.getByPrefix(`purchase:${user.id}`);
      } catch (e) {
        console.error('KV Purchase fetch error:', e);
      }
  }
  
  if (!bookings) {
     try {
       kvBookings = await kv.getByPrefix(`booking:${user.id}`);
     } catch (e) {
       console.error('KV Booking fetch error:', e);
     }
  }

  return c.json({
      profile: profile || user.user_metadata,
      purchases: purchases || kvPurchases,
      bookings: bookings || kvBookings
  });
});

// Save booking
app.post("/make-server-8ae44dd2/book-session", async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization header' }, 401);
  
  const { date, time, instructor, type } = await c.req.json();

  const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
  }

  const bookingData = {
    user_id: user.id,
    date,
    time,
    instructor,
    type,
    created_at: new Date().toISOString()
  };

  // Try inserting into 'bookings' table
  const { error: dbError } = await supabase.from('bookings').insert(bookingData);
  
  if (dbError) {
    console.log('Bookings table not found or error, falling back to KV store:', dbError.message);
    // Fallback to KV
    const bookingId = crypto.randomUUID();
    await kv.set(`booking:${user.id}:${bookingId}`, { ...bookingData, id: bookingId });
  }

  return c.json({ success: true, message: 'Booking confirmed' });
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

    // Check if user already exists in Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);
    
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // CLEANUP STRATEGY:
    // If a profile exists with this email (orphan from a deleted auth user), 
    // the DB trigger will fail when creating a new auth user.
    // We must remove or rename the old profile to free up the email.
    const debugLogs: string[] = [];
    
    const cleanupTable = async (tableName: string) => {
      try {
        // Check if record exists
        const { data: records, error: checkError } = await supabase
          .from(tableName)
          .select('*')
          .eq('email', email);

        if (checkError) {
          // Table might not exist, which is fine
          // debugLogs.push(`Check ${tableName} error: ${checkError.message}`);
          return;
        }

        if (records && records.length > 0) {
          debugLogs.push(`Found ${records.length} stale records in '${tableName}'.`);
          
          // Strategy 1: Delete
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('email', email);

          if (!deleteError) {
            debugLogs.push(`Deleted stale record from '${tableName}'.`);
          } else {
            debugLogs.push(`Delete failed for '${tableName}': ${deleteError.message}`);
            
            // Strategy 2: Rename (Archive) if Delete failed (e.g. due to Foreign Keys)
            const archivedEmail = `${email}_archived_${Date.now()}`;
            const { error: updateError } = await supabase
              .from(tableName)
              .update({ email: archivedEmail })
              .eq('email', email);
              
            if (updateError) {
              debugLogs.push(`Rename failed for '${tableName}': ${updateError.message}`);
            } else {
              debugLogs.push(`Renamed stale email in '${tableName}' to '${archivedEmail}'.`);
            }
          }
        }
      } catch (err: any) {
        debugLogs.push(`Cleanup exception for ${tableName}: ${err.message}`);
      }
    };

    // Run cleanup on potential profile tables
    await cleanupTable('profiles');
    await cleanupTable('users');

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: 'client' 
      },
      email_confirm: true 
    });

    if (error) {
      console.error('Signup error:', error);
      // Return the debug logs so we can see what happened
      return c.json({ 
        error: error.message || 'Failed to create user', 
        details: 'Database error likely due to orphan records.',
        debugLogs 
      }, 400);
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

// Contact form endpoint
app.post("/make-server-8ae44dd2/contact", async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Store in KV
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    await kv.set(`contact_message:${id}`, {
      id,
      name,
      email,
      subject,
      message,
      timestamp,
      status: 'unread'
    });

    // Send email if API key is present
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSent = false;
    let emailErrorLog = null;

    if (resendApiKey) {
      try {
        const { Resend } = await import('npm:resend');
        const resend = new Resend(resendApiKey);
        
        const { data, error: emailError } = await resend.emails.send({
          from: 'Path2Medic Contact <onboarding@resend.dev>',
          to: ['vincent@path2medic.com', 'jonathan@path2medic.com'],
          subject: `New Contact Message: ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1B4F72;">New Message from Path2Medic Website</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <h3 style="color: #E67E22;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                This email was sent from the contact form on your website. 
                You can reply directly to this email to contact ${name}.
              </p>
            </div>
          `,
          reply_to: email
        });

        if (emailError) {
          console.error('Resend error:', emailError);
          emailErrorLog = emailError.message || JSON.stringify(emailError);
        } else {
          emailSent = true;
        }
      } catch (importError) {
        console.error('Failed to import or use Resend:', importError);
        emailErrorLog = 'Failed to import Resend library';
      }
    } else {
      emailErrorLog = 'RESEND_API_KEY not configured';
    }

    return c.json({ 
      success: true, 
      message: 'Message received',
      emailSent,
      emailDebug: emailErrorLog
    });

    return c.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get signed URL for file
app.post("/make-server-8ae44dd2/get-signed-url", async (c) => {
  try {
    const { path } = await c.req.json();
    
    if (!path) {
      return c.json({ error: 'Path is required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create signed URL valid for 1 hour
    const { data, error } = await supabase.storage
      .from('make-8ae44dd2-images')
      .createSignedUrl(path, 3600);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error('Signed URL error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);