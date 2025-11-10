import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
// --- IMPORTAÇÕES DO FIREBASE ---
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// --- IMPORTAÇÕES DO GOOGLE SIGNIN ---
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// --- IMPORTAÇÕES DE NAVEGAÇÃO ---
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';

// A chave agora vem do process.env (graças ao .env)
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Configura o Google Sign-In uma vez
  useEffect(() => {
    if (!WEB_CLIENT_ID) {
      console.error("Variável de ambiente EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID não definida!");
      return;
    }
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  // --- LÓGICA DE LOGIN COM E-MAIL ---
  const handleLogin = async () => {
    // ... (lógica de login com e-mail/senha continua a mesma)
    if (email === '' || password === '') {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE LOGIN COM GOOGLE ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // 1. Inicia o fluxo de login nativo do Google
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new Error("Não foi possível obter o idToken do Google");
      }

      // 2. Cria a credencial do Firebase com o idToken do Google
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // 3. Faz o login no Firebase com essa credencial
      await signInWithCredential(auth, googleCredential);
      
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // usuário cancelou o fluxo
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operação já em progresso
      } else {
        Alert.alert("Erro no Login com Google", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Botão de Login com Google */}
      <View style={styles.buttonContainer}>
        <Button
          title="Entrar com Google"
          onPress={handleGoogleLogin}
          disabled={loading}
          color="#db4437"
        />
      </View>

      <Text style={styles.separator}>--- ou ---</Text>

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
          title={loading ? "Entrando..." : "Entrar com Email"} 
          onPress={handleLogin} 
          disabled={loading} 
        />
      </View>
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
  separator: {
    marginVertical: 15,
    textAlign: 'center',
    color: 'gray',
  }
});

export default LoginScreen;