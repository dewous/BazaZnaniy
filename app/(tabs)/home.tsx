import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useNavigation, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const userId = useSelector((state: RootState) => state.auth.id);
  const token = useSelector((state: RootState) => state.auth.token);

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteTopicIds, setFavoriteTopicIds] = useState<Set<string>>(new Set());
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      if (!token) throw new Error('Токен не найден');
      const [userRes, favSubjectsRes, favTopicsRes, allSubjectsRes] = await Promise.all([
        axios.get(`http://baze36.ru:3000/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://baze36.ru:3000/subjects/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://baze36.ru:3000/cards/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://baze36.ru:3000/subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUser(userRes.data);
      setFavorites(favSubjectsRes.data);
      setTopicsData(favTopicsRes.data);
      setFavoriteTopicIds(new Set(favTopicsRes.data.map((t: any) => t.id)));
      setSubjects(allSubjectsRes.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    }
  }, [token, userId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUser();
      setLoading(false);
    };

    if (userId && token) {
      loadData();
    }
  }, [fetchUser, userId, token]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [fetchUser])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  }, [fetchUser]);

  const getSubjectNameById = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    return subject ? subject.name : 'Предмет';
  };

  const toggleFavoriteTopic = async (topic: any) => {
    try {
      if (!token) throw new Error('Токен не найден');

      if (favoriteTopicIds.has(topic.id)) {
        await axios.delete(`http://baze36.ru:3000/cards/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { cardId: topic.id },
        });
        setFavoriteTopicIds(prev => {
          const updated = new Set(prev);
          updated.delete(topic.id);
          return updated;
        });
        setTopicsData(prev => prev.filter(t => t.id !== topic.id));
        Alert.alert('Успех', 'Тема удалена из избранного');
      } else {
        await axios.post(`http://baze36.ru:3000/cards/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          params: { cardId: topic.id },
        });
        setFavoriteTopicIds(prev => new Set(prev).add(topic.id));
        setTopicsData(prev => [...prev, topic]);
        Alert.alert('Успех', 'Тема добавлена в избранное');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  const toggleFavorite = async (subjectId: string) => {
    try {
      if (!token) throw new Error('Токен не найден');

      const isFavorite = favorites.some((subject) => subject.id === subjectId);

      if (isFavorite) {
        await axios.delete(`http://baze36.ru:3000/subjects/${subjectId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prevFavorites) =>
          prevFavorites.filter((subject) => subject.id !== subjectId)
        );
        Alert.alert('Успех', 'Предмет удалён из избранного');
      } else {
        await axios.post(
          `http://baze36.ru:3000/subjects/${subjectId}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const added = subjects.find((s) => s.id === subjectId);
        if (added) {
          setFavorites((prev) => [...prev, added]);
        }
        Alert.alert('Успех', 'Предмет добавлен в избранное');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3D76F7" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/avatar.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Добро пожаловать!</Text>
          <Text style={styles.name}>
            {user?.first_name || ''} {user?.last_name || ''}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Избранные предметы</Text>
          {favorites.length === 0 ? (
            <Text style={styles.emptyText}>У вас пока нет избранных предметов</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={styles.subjectCard}
                  onPress={() =>
                    router.push({
                      pathname: '/user/subject-content',
                      params: {
                        subjectId: subject.id,
                        title: subject.name,
                        description: subject.description || '',
                      },
                    })
                  }
                >
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(subject.id);
                    }}
                  >
                    <Ionicons name="star" size={20} color="#FFD700" />
                  </TouchableOpacity>
                  <View style={styles.cardContent}>
                    <Text style={styles.subjectTitle}>{subject.name}</Text>
                    <Text style={styles.subjectType}>{subject.subject_type}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Избранные темы</Text>
          {topicsData.length === 0 ? (
            <Text style={styles.emptyText}>У вас пока нет избранных тем</Text>
          ) : (
            <ScrollView
              style={styles.topicScrollContainer}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {topicsData.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicCard}
                  onPress={() =>
                    router.push({
                      pathname: '/user/topic-content',
                      params: {
                        topicId: topic.id,
                        title: topic.title,
                        description: topic.description,
                        subjectId: topic.subject_id,
                      },
                    })
                  }
                >
                  <View style={styles.topicHeader}>
                    <Text style={styles.topicTitle}>
                      {getSubjectNameById(topic.subject_id)}: {topic.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavoriteTopic(topic);
                      }}
                    >
                      <Ionicons name="star" size={20} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                  {topic.description ? (
                    <Text style={styles.topicDescription}>{topic.description}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 250,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subjectType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  topicCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flexShrink: 1,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
  },
  topicScrollContainer: {
    maxHeight: 420, // или другое значение
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
