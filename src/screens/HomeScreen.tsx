import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/RootNavigator';

// Tipagem para as props de navegação
type HomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao BaaS Showcase!</Text>
      <Text style={styles.subtitle}>
        Usuário: {auth.currentUser?.email}
      </Text>
      
      <View style={styles.menu}>
        {/* --- BOTÕES ADICIONADOS --- */}
        <View style={styles.buttonContainer}>
          <Button 
            title="Bloco 2: Firestore (Realtime)" 
            onPress={() => navigation.navigate('FirestoreDemo')} 
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Bloco 2: Supabase (SQL + RLS)" 
            onPress={() => navigation.navigate('SupabaseDemo')} 
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Bloco 3: Storage (Upload)" 
            onPress={() => navigation.navigate('StorageDemo')} 
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Bloco 4: Firestore (Offline)" 
            onPress={() => navigation.navigate('OfflineDemo')} 
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Sair" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: 'gray',
  },
  menu: {
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 5,
  }
});

export default HomeScreen;