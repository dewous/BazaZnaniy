import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Topic {
  id: string;
  title: string;
  description: string;
}

export default function UserTopicsPanel() {
  const { subjectId, subjectName } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
  }>();
  const token = useSelector((state: RootState) => state.auth.token);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchTopics = async () => {
    console.log('Загрузка тем для subjectId:', subjectId);
    try {
      const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
        params: { subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Темы загружены:', res.data);
      setTopics(res.data);
    } catch (error) {
      console.error('Ошибка при загрузке тем:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить темы');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = useCallback(async () => {
    console.log('Загрузка избранных тем');
    try {
      const res = await axios.get('http://baze36.ru:3000/cards/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoriteTopicIds = new Set<string>(res.data.map((t: { id: string }) => t.id));
      console.log('Избранные темы загружены:', Array.from(favoriteTopicIds));
      setFavorites(favoriteTopicIds);
    } catch (error) {
      console.error('Ошибка при загрузке избранных тем:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить избранные темы');
    }
  }, [token]);

  const toggleFavorite = async (topicId: string) => {
    console.log('Переключение избранного для темы:', topicId);
    try {
      if (favorites.has(topicId)) {
        console.log('Удаление из избранного:', topicId);
        await axios.delete(`http://baze36.ru:3000/cards/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { cardId: topicId },
        });
        setFavorites(prev => {
          const updated = new Set(prev);
          updated.delete(topicId);
          return updated;
        });
        Alert.alert('Успех', 'Тема удалена из избранного');
      } else {
        console.log('Добавление в избранное:', topicId);
        await axios.post(`http://baze36.ru:3000/cards/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          params: { cardId: topicId },
        });
        setFavorites(prev => new Set(prev).add(topicId));
        Alert.alert('Успех', 'Тема добавлена в избранное');
      }
    } catch (error) {
      console.error('Ошибка при переключении избранного:', error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  useEffect(() => {
    console.log('Монтирование компонента UserTopicsPanel');
    fetchTopics();
    fetchFavorites();
  }, [fetchFavorites]);

  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subjectType}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? 'star' : 'star-outline'}
            size={24}
            color={favorites.has(item.id) ? '#FFD700' : '#D3D3D3'}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          console.log('Переход к содержимому темы:', item.id);
          router.push({
            pathname: '/user/topic-content',
            params: {
              topicId: item.id,
              title: item.title,
              description: item.description,
              subjectId,
            },
          });
        }}
        style={styles.viewContentButton}
      >
        <Text style={styles.viewContentButtonText}>Просмотреть содержимое темы</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/subjects')}>
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Ко всем предметам</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Темы: {subjectName}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3D76F7" />
        ) : topics.length === 0 ? (
          <Text style={styles.emptyText}>Темы не найдены</Text>
        ) : (
          <FlatList
            data={topics}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6e6e6e',
    marginTop: 32,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subjectType: {
    fontSize: 14,
    color: '#6e6e6e',
  },
  viewContentButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3D76F7',
    alignItems: 'center',
  },
  viewContentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  favoriteButton: {
    padding: 6,
  },
});
