import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';

export default function AddTopicScreen() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  // Преобразование subjectId в целое число
  const subjectIdNumber = parseInt(subjectId as string, 10);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название темы');
      return;
    }

    // Запрещаем отправку формы, если поле комментариев пустое
    if (!description.trim()) {
      Alert.alert('Ошибка', 'Введите описание темы');
      return;
    }

    try {
      setLoading(true);
      console.log('Отправка запроса на создание темы...', { title, description, subjectId: subjectIdNumber });

      const response = await axios.post(
        `http://baze36.ru:3000/cards`,
        {
          title,
          description,
          subject_id: subjectIdNumber, // Используем целочисленный subjectId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Ответ от сервера:', response.data);
      Alert.alert('Успех', 'Тема успешно добавлена');
      router.back();
    } catch (error: any) {
      console.error('Ошибка при отправке запроса:', error);
      
      if (error.response) {
        console.error('Ответ сервера с ошибкой:', error.response.data);
        Alert.alert('Ошибка', error.response.data.message || 'Не удалось создать тему');
      } else {
        console.error('Ошибка без ответа от сервера:', error.message);
        Alert.alert('Ошибка', error.message || 'Не удалось создать тему');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Название темы</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Введение в тему"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Описание темы (обязательно)"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
  },
});
