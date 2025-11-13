import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../config/supabaseConfig'; 
import { auth } from '../config/firebaseConfig'; 
import { decode } from 'base-64'; // <--- 1. IMPORTANTE: Importe o decode

// 2. IMPORTANTE: Adicione este Polyfill para o Supabase funcionar
if (typeof atob === 'undefined') {
  global.atob = decode;
}

const SupabaseDemoScreen = () => {
  const [loading, setLoading] = useState(false);
  const [profileText, setProfileText] = useState('');

  // 1. REGISTRA USUÁRIO NO SUPABASE AUTH (sincronizando)
  const syncUser = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert("Erro", "Você precisa estar logado no Firebase primeiro.");
      return;
    }

    setLoading(true);
    
    // Tenta criar o usuário no Supabase
    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: 'password_secreto_para_teste', 
    });
    
    setLoading(false);
    
    if (error) {
      // Se o usuário já existe, não é exatamente um erro para nossa demo
      if (error.message.includes("already registered")) {
        Alert.alert("Info", "Usuário já sincronizado no Supabase.");
      } else {
        Alert.alert("Erro ao Sincronizar", error.message);
      }
    } else {
      Alert.alert("Sucesso", "Usuário sincronizado com Supabase Auth.");
    }
  };
  
  // 2. TENTA LER O PERFIL (DEMO RLS)
  const fetchProfile = async () => {
    setLoading(true);
    
    // Consulta SQL simples: SELECT * FROM profiles
    // O RLS do Supabase vai filtrar os resultados automaticamente
    const { data, error } = await supabase
      .from('profiles') // Certifique-se de ter criado essa tabela no Supabase
      .select('*'); 
      
    setLoading(false);
    
    if (error) {
      Alert.alert("Erro ao Buscar (Supabase)", error.message);
    } else if (data && data.length > 0) {
      setProfileText(JSON.stringify(data, null, 2));
    } else {
      setProfileText("Nenhum dado retornado. (O RLS pode estar bloqueando ou a tabela está vazia)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Bloco 2: Supabase (SQL + RLS)
      </Text>
      <Text style={styles.info}>
        Esta tela demonstra a sincronização e consulta SQL segura.
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
          title="2. Buscar Dados (Demo RLS)" 
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  info: { textAlign: 'center', padding: 10, backgroundColor: '#eee', borderRadius: 5, marginBottom: 10, fontSize: 12 },
  buttonContainer: { marginVertical: 10 },
  result: { marginTop: 20, fontSize: 12, fontFamily: 'monospace', padding: 10, backgroundColor: '#f0f0f0' }
});

export default SupabaseDemoScreen;