import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { supabase } from '../config/supabaseConfig'; // Importa nosso cliente
import { auth } from '../config/firebaseConfig'; // Usamos o auth do Firebase

const SupabaseDemoScreen = () => {
  const [loading, setLoading] = useState(false);
  const [profileText, setProfileText] = useState('');

  // 1. REGISTRA USUÁRIO NO SUPABASE AUTH (sincronizando)
  // O ideal é fazer isso no registro, mas aqui simulamos
  const syncUser = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    setLoading(true);
    // Simula um registro no Supabase Auth com o mesmo email
    // (Em um app real, você usaria o mesmo provedor ou JWT customizado)
    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: 'password_secreto_para_teste', // Senha de teste
    });
    setLoading(false);
    if (error) Alert.alert("Erro ao Sincronizar", error.message);
    else Alert.alert("Sucesso", "Usuário sincronizado com Supabase Auth. (Verifique seu email para confirmar no Supabase)");
  };
  
  // 2. TENTA LER O PERFIL (DEMO RLS) [cite: 42, 43]
  const fetchProfile = async () => {
    setLoading(true);
    // Esta é a consulta Supabase [cite: 42]
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', auth.currentUser?.uid); // Tentamos buscar com o ID do Firebase
      // (NOTA: Isso só funciona se os IDs estiverem sincronizados)
      
    setLoading(false);
    if (error) {
      Alert.alert("Erro ao Buscar Perfil (RLS)", error.message);
    } else if (data && data.length > 0) {
      setProfileText(data[0].username);
    } else {
      setProfileText("Nenhum perfil encontrado. O RLS  pode ter bloqueado ou o perfil não existe.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Esta tela demonstra uma consulta SQL ao Supabase, protegida por RLS.
      </Text>
      <Text style={styles.info}>
        (Pré-requisito: O usuário do Firebase deve existir no Supabase Auth com o mesmo ID)
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="1. Sincronizar Auth (Simulação)" 
          onPress={syncUser} 
          disabled={loading} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="2. Buscar Meu Perfil (Demo RLS)" 
          onPress={fetchProfile} 
          disabled={loading} 
        />
      </View>

      {profileText !== '' && (
        <Text style={styles.result}>Resultado: {profileText}</Text>
      )}
    </View>
  );
};

// ... (Estilos)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  info: { textAlign: 'center', padding: 10, backgroundColor: '#eee', borderRadius: 5, marginBottom: 10, fontSize: 12 },
  buttonContainer: { marginVertical: 10 },
  result: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});

export default SupabaseDemoScreen;