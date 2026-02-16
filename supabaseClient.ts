import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wzlkkbitespgurpncamy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bGtrYml0ZXNwZ3VycG5jYW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjgzODEsImV4cCI6MjA4NjUwNDM4MX0.xSz72jXv7QWckfGrvc5GjpQjXylFupVsGX4mpuqu7Cc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);