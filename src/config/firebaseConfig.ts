import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// Não importamos mais o getStorage, pois usaremos o Supabase Storage

// 1. As chaves agora são lidas do arquivo .env
// O Expo injeta as variáveis do .env no process.env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// 2. Verificação (Opcional, mas boa prática)
// Avisa no console se as chaves não foram carregadas
if (!firebaseConfig.apiKey) {
  console.error("ERRO: As variáveis de ambiente do Firebase não foram carregadas.");
  console.error("Verifique seu arquivo .env e reinicie o servidor com 'npx expo start --clear'");
}

// 3. Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 4. Inicializa o Auth (com persistência no celular)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// 5. Inicializa o Firestore (Banco de Dados)
const db = getFirestore(app);

// 6. Exporta apenas os serviços que estamos usando do Firebase
export { auth, db };