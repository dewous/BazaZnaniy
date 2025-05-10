import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface TopicContent {
  id: string;
  title: string;
  description: string;
  content: string;
}

export default function TopicContentScreen() {
  const { topicId, title, description, subjectId } = useLocalSearchParams<{
    topicId: string,
    title: string,
    description: string,
    subjectId: string,
  }>();

  const token = useSelector((state: RootState) => state.auth.token);
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTopic = async () => {
    console.log('Запрос на получение темы', topicId);

    try {
      const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
        params: { subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Успешно получена тема:', res.data);
      setTopic(res.data);
    } catch (error: any) {
      console.error('Ошибка при получении темы:', error?.message || error);
      Alert.alert('Ошибка', 'Не удалось загрузить содержимое темы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{title}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3D76F7" />
        ) : topic ? (
          <ScrollView style={styles.contentBox}>
            <Text style={styles.label}>Описание:</Text>
            <Text style={styles.text}>{topic.description}</Text>

            <Text style={styles.label}>Содержимое:</Text>
            <Text style={styles.text}>{topic.content || 'Нет содержимого.'}</Text>
          </ScrollView>
        ) : (
          <Text style={styles.errorText}>Содержимое не найдено</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(248,249,250,0.1)', // немного прозрачный фон, чтобы текст был читаем
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  contentBox: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
    color: '#3D3D3D',
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
