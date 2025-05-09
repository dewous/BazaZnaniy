import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function HomeScreen() {
  const userId = useSelector((state: RootState) => state.auth.id); // Получаем userId из Redux
  const token = useSelector((state: RootState) => state.auth.token); // Получаем токен из Redux

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) throw new Error('Токен не найден');
        const response = await axios.get(`http://baze36.ru:3000/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Сохраняем данные пользователя в состояние
      } catch (error: any) {
        console.error(error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUser(); // Загружаем данные пользователя при монтировании компонента
    }
  }, [userId, token]);

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
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.sectionTitle}>Здесь появится ваш контент позже</Text>
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
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
