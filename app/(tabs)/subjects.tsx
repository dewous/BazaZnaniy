import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Profile() {
  const token = useSelector((state: RootState) => state.auth.token);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set()); // Храним список избранных предметов

  // Получаем все предметы
  const fetchSubjects = useCallback(async () => {
    try {
      if (!token) throw new Error('Токен не найден');
      const response = await axios.get('http://baze36.ru:3000/subjects/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(response.data);
    } catch (error: any) {
      console.error(error);
      setError('Не удалось загрузить предметы');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Получаем избранные предметы
  const fetchFavorites = useCallback(async () => {
    try {
      if (!token) throw new Error('Токен не найден');
      const response = await axios.get('http://baze36.ru:3000/subjects/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Убедитесь, что subject.id является строкой
      const favoriteSubjects = new Set<string>(response.data.map((subject: { id: string }) => subject.id));
      setFavorites(favoriteSubjects);
    } catch (error: any) {
      console.error(error);
      setError('Не удалось загрузить избранные предметы');
    }
  }, [token]);

  // Функция для добавления или удаления из избранного
  const toggleFavorite = async (subjectId: string) => {
    try {
      if (!token) throw new Error('Токен не найден');
      
      if (favorites.has(subjectId)) {
        await axios.delete(`http://baze36.ru:3000/subjects/${subjectId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prevFavorites) => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.delete(subjectId);
          return newFavorites;
        });
        Alert.alert('Успех', 'Предмет удален из избранного');
      } else {
        await axios.post(`http://baze36.ru:3000/subjects/${subjectId}/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prevFavorites) => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.add(subjectId);
          return newFavorites;
        });
        Alert.alert('Успех', 'Предмет добавлен в избранное');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchFavorites();
  }, [fetchSubjects, fetchFavorites]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3D76F7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
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
        <Text style={styles.title}>Все предметы</Text>
        <ScrollView contentContainerStyle={styles.subjectsContainer}>
          {subjects.map((subject) => (
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
              <View style={styles.cardContent}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectType}>{subject.subject_type}</Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation(); // Чтобы нажатие по звезде не вызывало переход
                  toggleFavorite(subject.id);
                }}
              >
                <Ionicons
                  name={favorites.has(subject.id) ? 'star' : 'star-outline'}
                  size={30} // Увеличен размер иконки
                  color={favorites.has(subject.id) ? '#FFD700' : '#D3D3D3'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  subjectsContainer: {
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20, // Увеличено расстояние для карточки
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  subjectName: {
    fontSize: 22, // Увеличен шрифт для имени предмета
    fontWeight: 'bold',
    color: '#333',
  },
  subjectType: {
    fontSize: 14, // Увеличен шрифт для типа предмета
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
