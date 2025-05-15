import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aauuhmqqvxxqhcgobywf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdXVobXFxdnh4cWhjZ29ieXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTY4ODAsImV4cCI6MjA2MjI3Mjg4MH0.0sJiabS1A8yDZ_zbWm-3gc6RjZ3v_hreaLr_fBVQ5FA';

export const supabase = createClient(supabaseUrl, supabaseKey);
