import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabaseConfig'; // <-- Importa o Supabase
import * as FileSystem from 'expo-file-system'; // <-- Para ler o arquivo
import { decode } from 'base-64'; // <-- Para decodificar

// Polyfill para o Supabase funcionar com Base64
if (typeof atob === 'undefined') {
  global.atob = decode;
}

const StorageDemoScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDownloadUrl(null); // Limpa a imagem anterior
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;
    setUploading(true);

    try {
      // 1. Lê o arquivo de imagem do celular como Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const fileExt = filename.split('.').pop();
      const contentType = `image/${fileExt}`;
      
      // 2. Faz o upload para o Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('uploads') // O nome do seu bucket
        .upload(filename, decode(base64), { // Decodifica o Base64
          contentType,
          upsert: true, // Sobrescreve se já existir
        });

      if (uploadError) {
        throw uploadError;
      }
      
      // 3. Pega a URL pública da imagem que acabamos de enviar
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      setDownloadUrl(urlData.publicUrl);
      Alert.alert("Sucesso", "Upload para o Supabase concluído!");
      
    } catch (error: any) {
      Alert.alert("Erro no Upload (Supabase)", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        Selecione uma imagem e faça o upload para o **Supabase Storage**.
      </Text>
      <Button title="Selecionar Imagem" onPress={selectImage} />
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      
      {uploading && (
        <Text style={styles.progress}>Enviando... (Sem % no Supabase)</Text>
      )}

      {imageUri && !uploading && (
        <Button title="Fazer Upload da Imagem" onPress={uploadImage} />
      )}

      {downloadUrl && (
        <View>
          <Text style={styles.info}>Imagem no Supabase Storage:</Text>
          <Image source={{ uri: downloadUrl }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

// ... (Estilos - são os mesmos de antes)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  info: { textAlign: 'center', padding: 10, marginVertical: 10 },
  image: { width: 200, height: 200, marginVertical: 20, borderWidth: 1, borderColor: '#ccc' },
  progress: { fontSize: 18, marginVertical: 10 }
});

export default StorageDemoScreen;