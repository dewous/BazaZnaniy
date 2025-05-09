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
import { useNavigation, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const userId = useSelector((state: RootState) => state.auth.id);
  const token = useSelector((state: RootState) => state.auth.token);

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      if (!token) throw new Error('Токен не найден');
      const [userRes, favRes] = await Promise.all([
        axios.get(`http://baze36.ru:3000/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://baze36.ru:3000/subjects/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUser(userRes.data);
      setFavorites(favRes.data);
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

  // Функция для добавления/удаления предмета из избранного
  const toggleFavorite = async (subjectId: string) => {
    try {
      if (!token) throw new Error('Токен не найден');

      // Проверяем, находится ли предмет в избранном
      const isFavorite = favorites.some((subject) => subject.id === subjectId);

      if (isFavorite) {
        // Удаляем из избранного
        await axios.delete(`http://baze36.ru:3000/subjects/${subjectId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites((prevFavorites) => prevFavorites.filter((subject) => subject.id !== subjectId));
        Alert.alert('Успех', 'Предмет удален из избранного');
      } else {
        // Добавляем в избранное
        await axios.post(`http://baze36.ru:3000/subjects/${subjectId}/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites((prevFavorites) => [
          ...prevFavorites,
          { id: subjectId, name: 'Предмет', subject_type: 'Тип' }, // Вам нужно будет добавить данные о предмете, если они не приходят с сервера
        ]);
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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
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
            favorites.map((subject) => (
              <View key={subject.id} style={styles.subjectCard}>
                <View style={styles.cardContent}>
                  <Text style={styles.subjectTitle}>{subject.name}</Text>
                  <Text style={styles.subjectType}>{subject.subject_type}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(subject.id)}
                >
                  <Ionicons
                    name="star"
                    size={24}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ translateY: -5 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  favoriteButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
