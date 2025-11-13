import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabaseConfig';
import { readAsStringAsync } from 'expo-file-system/legacy'; // <-- MUDANÇA 1: Importado da API 'legacy'
import { decode } from 'base-64';

// Polyfill: Garante que a função 'atob' (necessária para o Supabase) exista
if (typeof atob === 'undefined') {
  global.atob = decode;
}

const StorageDemoScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // 1. Selecionar imagem da galeria
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDownloadUrl(null);
    }
  };

  // 2. Fazer o upload para o Supabase
  const uploadImage = async () => {
    if (!imageUri) return;
    setUploading(true);

    try {
      // MUDANÇA 2: Usamos a função 'readAsStringAsync' diretamente (sem 'FileSystem.')
      const base64 = await readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const fileExt = filename.split('.').pop();
      const contentType = `image/${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('uploads') 
        .upload(filename, decode(base64), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);

      setDownloadUrl(urlData.publicUrl);
      Alert.alert("Sucesso", "Upload para o Supabase concluído!");
      
    } catch (error: any) {
      console.log(error);
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
        <Text style={styles.progress}>Enviando para a nuvem...</Text>
      )}

      {imageUri && !uploading && (
        <Button title="Fazer Upload da Imagem" onPress={uploadImage} />
      )}

      {downloadUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.info}>Imagem salva no Supabase:</Text>
          <Image source={{ uri: downloadUrl }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  info: { textAlign: 'center', padding: 10, marginVertical: 10, fontSize: 16 },
  image: { width: 200, height: 200, marginVertical: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 },
  progress: { fontSize: 18, marginVertical: 10, color: 'blue' },
  resultContainer: { alignItems: 'center', marginTop: 20, borderTopWidth: 1, borderColor: '#eee', width: '100%' }
});

export default StorageDemoScreen;