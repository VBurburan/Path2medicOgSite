import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbfolxwbrjpajylkphwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZm9seHdicmpwYWp5bGtwaHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTc3NTcsImV4cCI6MjA4MzgzMzc1N30.gLfAc85pOSDR1aOTxHxEfXYlz7KJBsKyht3NuYxi93M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CertificationLevel = 'EMT' | 'AEMT' | 'Paramedic';

export interface Student {
  id: string;
  user_id: string;
  name: string;
  email: string;
  certification_level: CertificationLevel;
  created_at: string;
}
