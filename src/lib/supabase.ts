import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || "https://cktnfydvfaszghzqqylq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdG5meWR2ZmFzemdoenFxeWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NjY2MTgsImV4cCI6MjA5MDM0MjYxOH0.bHWOUzJnjXZ93vvTntY1phCZJVOgxiqdavpFyd_nG-I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
