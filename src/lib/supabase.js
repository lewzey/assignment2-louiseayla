import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uxhcttngzxsgooqreirs.supabase.co';
const supabaseAnonKey = 'sb_publishable_3qiBq1nx1efB7fCw7BZXwQ_n3WX2BfY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;