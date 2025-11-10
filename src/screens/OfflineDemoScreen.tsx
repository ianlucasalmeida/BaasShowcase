import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native'; // <-- CORRIGIDO
import { db, auth } from '../config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy,
  enableNetwork, // <-- Simula rede ON
  disableNetwork // <-- Simula rede OFF
} from 'firebase/firestore';

interface Report {
  id: string;
  text: string;
  synced: boolean;
}

const OfflineDemoScreen = () => {
  const [report, setReport] = useState('');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Ativa a persistência offline do Firestore (requer configuração no firebaseConfig.ts)
    // No SDK v9 (web), a persistência é ativada por padrão no navegador.
    // No Expo, o comportamento pode variar, mas geralmente funciona.
    
    const q = query(collection(db, 'offlineReports'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reps: Report[] = [];
      querySnapshot.forEach((doc) => {
        reps.push({
          id: doc.id,
          text: doc.data().text,
          synced: !doc.metadata.hasPendingWrites // Verifica se está pendente
        });
      });
      setReports(reps);
    });
    return () => unsubscribe();
  }, []);

  const handleAddReport = async () => {
    if (report.trim() === '') return;
    try {
      // Este é o 'novo documento'
      await addDoc(collection(db, 'offlineReports'), {
        text: report,
        createdAt: new Date(),
        user: auth.currentUser?.uid,
      });
      setReport('');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o relatório.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        O Firestore salva dados localmente primeiro. Desative a rede para testar.
      </Text>
      <View style={styles.buttonContainer}>
        {/* Simula a perda de rede */}
        <Button title="Desativar Rede (Simulação)" color="red" onPress={() => disableNetwork(db)} />
        {/* Simula a volta da rede */}
        <Button title="Ativar Rede (Simulação)" color="green" onPress={() => enableNetwork(db)} />
      </View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.report, !item.synced && styles.reportPending]}>
            <Text>{item.text}</Text>
            <Text style={styles.syncStatus}>{item.synced ? 'Sincronizado' : 'Pendente'}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Novo relatório de campo..."
          value={report}
          onChangeText={setReport}
        />
        <Button title="Salvar" onPress={handleAddReport} />
      </View>
      <Text style={styles.info}>
        Adicione um item com a rede 'Desativada'. Ele aparecerá como 'Pendente'. 
        Depois, 'Ative' a rede e veja ele sincronizar.
      </Text>
    </View>
  );
};

// ... (Estilos)
const styles = StyleSheet.create({
  container: { flex: 1 },
  info: { textAlign: 'center', padding: 10, backgroundColor: '#eee', margin: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  report: { backgroundColor: '#f9f9f9', padding: 15, marginHorizontal: 10, marginVertical: 4, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  reportPending: { backgroundColor: '#fff8e1', borderColor: '#ffe082' },
  syncStatus: { fontSize: 10, color: 'gray', fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  input: { flex: 1, borderColor: 'gray', borderWidth: 1, marginRight: 10, padding: 8, borderRadius: 5 },
});

export default OfflineDemoScreen;