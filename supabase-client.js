import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://cpjietwlcprdxtzrcevp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamlldHdsY3ByZHh0enJjZXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjU1NTYsImV4cCI6MjA5ODAwMTU1Nn0.Tn7Gg_JntTZFbfjOkBBKKOGx_dD3zSn8LZHnsEH89LA"; // только anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);