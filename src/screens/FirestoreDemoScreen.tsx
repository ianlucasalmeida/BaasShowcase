import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  user: string;
}

const FirestoreDemoScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Query para buscar mensagens, ordenadas pela mais recente
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

    // O onSnapshot é o ouvinte em tempo real [cite: 44]
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(), // Converte timestamp
          user: data.user,
        });
      });
      setMessages(msgs);
    });

    // Limpa o ouvinte ao desmontar
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (message.trim() === '') return;
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        createdAt: new Date(),
        user: auth.currentUser?.email || 'anônimo',
      });
      setMessage(''); // Limpa o campo
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Esta tela sincroniza mensagens em tempo real com o Firestore[cite: 45].</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.messageUser}>{item.user}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        inverted // Mostra as mais novas embaixo
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </View>
  );
};

// ... (Estilos)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  info: { textAlign: 'center', padding: 10, backgroundColor: '#eee', borderRadius: 5, marginBottom: 10 },
  message: { backgroundColor: '#f0f0f0', padding: 10, marginVertical: 4, borderRadius: 5 },
  messageUser: { fontWeight: 'bold', fontSize: 12, color: '#555' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderColor: 'gray', borderWidth: 1, marginRight: 10, padding: 8, borderRadius: 5 },
});

export default FirestoreDemoScreen;