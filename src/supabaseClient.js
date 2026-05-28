import { createClient } from '@supabase/supabase-js';

// O React (Vite) vai injetar essas chaves na hora de rodar, mas elas não ficam visíveis no código-fonte público
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);