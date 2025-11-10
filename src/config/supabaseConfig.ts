// Necessário para o Supabase funcionar no React Native
import 'react-native-url-polyfill/auto'; 
import { createClient } from '@supabase/supabase-js';

// !! IMPORTANTE !!
// Cole aqui as chaves do seu projeto Supabase
const supabaseUrl = 'SEU_SUPABASE_URL';
const supabaseAnonKey = 'SUA_SUPABASE_ANON_KEY';

// Inicializa o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);