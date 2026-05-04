import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // Surface missing environment setup early during local development.
  // eslint-disable-next-line no-console
  console.error('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl || '', supabasePublishableKey || '');
