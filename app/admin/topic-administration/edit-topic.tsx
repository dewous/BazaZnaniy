import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';

export default function EditTopicScreen() {
  const { id, title, description, content, subjectId } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    content: string
    subjectId: string;
  }>();

  const token = useSelector((state: RootState) => state.auth.token);

  const [topicTitle, setTopicTitle] = useState(title);
  const [topicDescription, setTopicDescription] = useState(description);
  const [topicContent, setTopicContent] = useState(content);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      console.log('Начинаю загрузку содержимого темы...');
      try {
        const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {subjectId}
        });
        console.log('Содержимое темы загружено:', res.data);;
      } catch (error) {
        console.error('Ошибка при загрузке содержимого темы:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить содержимое темы');
      } finally {
        setLoading(false);
        console.log('Загрузка завершена');
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!topicTitle.trim()) {
      Alert.alert('Ошибка', 'Название не может быть пустым');
      console.log('Попытка сохранить пустое название');
      return;
    }

    console.log('Начинаю сохранение изменений...');
    setSubmitting(true);
    try {
      const res = await axios.patch(
        `http://baze36.ru:3000/cards/${id}`,
        {
          title: topicTitle,
          description: topicDescription,
          content: topicContent,
          subjectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Тема обновлена успешно:', res.data);
      Alert.alert('Успех', 'Тема обновлена', [
        { text: 'ОК', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setSubmitting(false);
      console.log('Сохранение завершено');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Редактирование темы</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3D76F7" />
        ) : (
          <>
            <Text style={styles.label}>Название</Text>
            <TextInput
              value={topicTitle}
              onChangeText={(text) => {
                console.log('Изменение названия:', text);
                setTopicTitle(text);
              }}
              style={styles.input}
              placeholder="Введите название темы"
              placeholderTextColor="gray"
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
              value={topicDescription}
              onChangeText={(text) => {
                console.log('Изменение описания:', text);
                setTopicDescription(text);
              }}
              style={styles.input}
              placeholder="Введите описание"
              placeholderTextColor="gray"
            />

            <Text style={styles.label}>Содержимое</Text>
            <TextInput
              value={topicContent}
              onChangeText={(text) => {
                console.log('Изменение содержимого:', text);
                setTopicContent(text);
              }}
              style={[styles.input, styles.contentInput]}
              placeholder="Введите содержимое темы"
              multiline
              placeholderTextColor="gray"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={submitting}
            >
              <Text style={styles.saveButtonText}>
                {submitting ? 'Сохранение...' : 'Сохранить изменения'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
    marginLeft: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#3D3D3D',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
    color: 'black',
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#3D76F7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
