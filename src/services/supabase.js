import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://qeexnszapogreafsgxqx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZXhuc3phcG9ncmVhZnNneHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwNjMzMzAsImV4cCI6MjAzMTYzOTMzMH0.EJoxd-k87qYXvjtbWEuSWYPZ-O27Vu6hDhtjl59gkCA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
