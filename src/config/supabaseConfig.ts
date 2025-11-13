// Necessário para o Supabase funcionar no React Native
import 'react-native-url-polyfill/auto'; 
import { createClient } from '@supabase/supabase-js';

// As chaves agora são lidas do .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificação (boa prática)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Aviso: Variáveis de ambiente do Supabase não foram carregadas.");
  console.warn("Verifique seu .env e reinicie o servidor com 'npx expo start --clear'");
}

// Inicializa o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);