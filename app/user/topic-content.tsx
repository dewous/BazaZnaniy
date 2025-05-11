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
  subjectId: string;
}

export default function TopicContentScreen() {
  const { topicId, title,  description, subjectId} = useLocalSearchParams<{
    topicId: string;
    title: string;
    description: string;
    subjectId: string;
  }>();

  console.log('Полученные параметры из useLocalSearchParams:', {
    topicId,
    title,
    description,
    subjectId
  });

  const token = useSelector((state: RootState) => state.auth.token);
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTopic = async () => {
    console.log('[fetchTopic] Старт запроса для topicId:', topicId);  

    try {
      const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { subjectId } 
      });

      console.log('[fetchTopic] Ответ от сервера:', res.data);

      setTopic(res.data[0] || null);
    } catch (error: any) {
      console.error('[fetchTopic] Ошибка при запросе темы:', error?.message || error);
      Alert.alert('Ошибка', 'Не удалось загрузить содержимое темы');
    } finally {
      setLoading(false);
      console.log('[fetchTopic] Завершён запрос');
    }
  };

  useEffect(() => {
    console.log('[useEffect] Монтирование компонента. Запускаем fetchTopic()');
    fetchTopic();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('[UI] Нажата кнопка Назад');
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>{title}</Text>

        {loading ? (
          <>
            <ActivityIndicator size="large" color="#3D76F7" />
            {console.log('[UI] Показываем индикатор загрузки')}
          </>
        ) : topic ? (
          <ScrollView style={styles.contentBox}>
            <Text style={styles.label}>Описание:</Text>
            <Text style={styles.text}>{description}</Text>

            <Text style={styles.label}>Содержимое:</Text>
            <Text style={styles.text}>
              {topic?.content?.trim() || 'Нет содержимого.'}
            </Text>
          </ScrollView>
        ) : (
          <>
            <Text style={styles.errorText}>Содержимое не найдено</Text>
            {console.log('[UI] Тема не найдена или пустая')}
          </>
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
    backgroundColor: 'rgba(248,249,250,0.1)',
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
    color: 'black',
  },
  text: {
    fontSize: 15,
    color: 'black',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
