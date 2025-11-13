import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Importa apenas o necessário para o login com E-mail
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Importa os tipos de navegação
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Lógica de Login com E-mail (única opção agora)
  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      // Função do Bloco 1: signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, email, password);
      // O `onAuthStateChanged` no RootNavigator cuidará da transição de tela
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Formulário de E-mail/Senha */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Entrando..." : "Entrar"} 
          onPress={handleLogin} 
          disabled={loading} 
        />
      </View>
      
      {/* Botão de Registro */}
      <View style={styles.buttonContainer}>
        <Button
          title="Não tem conta? Crie uma"
          onPress={() => navigation.navigate('Register')}
          color="gray"
        />
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 5,
  },
});

export default LoginScreen;