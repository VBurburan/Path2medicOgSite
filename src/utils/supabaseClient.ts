import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kbfolxwbrjpajylkphwl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZm9seHdicmpwYWp5bGtwaHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTc3NTcsImV4cCI6MjA4MzgzMzc1N30.gLfAc85pOSDR1aOTxHxEfXYlz7KJBsKyht3NuYxi93M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
