import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Importa nosso auth configurado

// --- Telas de Autenticação ---
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// --- Telas Principais (Logado) ---
import HomeScreen from '../screens/HomeScreen';
import FirestoreDemoScreen from '../screens/FirestoreDemoScreen';
import SupabaseDemoScreen from '../screens/SupabaseDemoScreen';
import StorageDemoScreen from '../screens/StorageDemoScreen';
import OfflineDemoScreen from '../screens/OfflineDemoScreen';

// --- DEFINIÇÃO DE TIPOS DAS ROTAS ---

// Telas que o usuário vê se NÃO estiver logado
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Telas que o usuário vê se ESTIVER logado
export type MainStackParamList = {
  Home: undefined;
  FirestoreDemo: undefined; // Bloco 2 (Firebase)
  SupabaseDemo: undefined;  // Bloco 2 (Supabase)
  StorageDemo: undefined;     // Bloco 3
  OfflineDemo: undefined;     // Bloco 4
};

// Instancia os navegadores
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// --- COMPONENTES DE NAVEGAÇÃO ---

/**
 * Navegador para usuários NÃO autenticados.
 * Mostra as telas de Login e Registro.
 */
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

/**
 * Navegador para usuários AUTENTICADOS.
 * Mostra a Home (Menu) e todas as telas de demonstração.
 */
const MainNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'BaaS Showcase' }} 
    />
    <MainStack.Screen 
      name="FirestoreDemo" 
      component={FirestoreDemoScreen} 
      options={{ title: 'Bloco 2: Firestore Realtime' }} 
    />
    <MainStack.Screen 
      name="SupabaseDemo" 
      component={SupabaseDemoScreen} 
      options={{ title: 'Bloco 2: Supabase RLS' }} 
    />
    <MainStack.Screen 
      name="StorageDemo" 
      component={StorageDemoScreen} 
      options={{ title: 'Bloco 3: Storage Upload' }} 
    />
    <MainStack.Screen 
      name="OfflineDemo" 
      component={OfflineDemoScreen} 
      options={{ title: 'Bloco 4: Firestore Offline' }} 
    />
  </MainStack.Navigator>
);

/**
 * O Navegador Raiz (Root).
 * Ele controla qual dos navegadores (Auth ou Main) deve ser exibido
 * com base no estado de login do usuário no Firebase.
 */
const RootNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa carregando

  // Este é o ouvinte "onAuthStateChanged" do Bloco 1 do seu PDF
  useEffect(() => {
    // A função 'onAuthStateChanged' retorna um 'unsubscribe'
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Define o usuário (seja ele null ou um objeto User)
      setLoading(false); // Para de carregar
    });

    // Limpa o ouvinte quando o componente é desmontado
    // Isso evita vazamentos de memória
    return () => unsubscribe();
  }, []);

  // Mostra um loading enquanto o Firebase verifica o estado de auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderiza o Navegador de Auth ou o Principal
  // baseado no estado do usuário (se `user` existe ou é `null`)
  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;