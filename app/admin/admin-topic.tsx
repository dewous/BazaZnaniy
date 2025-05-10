import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
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

export default function AdminTopicsPanel() {
  const { subjectId, subjectName } = useLocalSearchParams<{ subjectId: string; subjectName: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    console.log('Запрос тем по предмету начат:', subjectId);
    try {
      const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
        params: { subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Ответ получен успешно:', res.data);
      setTopics(res.data);
    } catch (error: any) {
      console.error('Ошибка при загрузке тем:', error?.message || error);
      Alert.alert('Ошибка', 'Не удалось загрузить темы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

    const deleteTopic = async (id: string) => {
        console.log(`Попытка удалить тему с id: ${id}`); // Логируем начало удаления
        Alert.alert('Удалить тему?', 'Это действие нельзя отменить.', [
        { text: 'Отмена', style: 'cancel' },
        {
            text: 'Удалить',
            style: 'destructive',
            onPress: async () => {
            console.log('Попытка удаления через onPress:', id); // Логируем момент подтверждения удаления
            try {
                console.log('Отправка запроса на удаление темы...');
                const res = await axios.delete(`http://baze36.ru:3000/cards/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Ответ при удалении темы:', res.data); // Логируем ответ от сервера
                setTopics((prev) => {
                console.log('Обновление списка тем после удаления:', prev);
                return prev.filter(topic => topic.id !== id);
                });
            } catch (error: any) {
                console.error('Ошибка при удалении темы:', error?.message || error); // Логируем ошибку
                Alert.alert('Ошибка', 'Не удалось удалить тему');
            }
            },
        },
        ]);
    };

  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/admin/edit-topic',
              params: {
                id: item.id,
                title: item.title,
                description: item.description,
                subjectId,
              },
            })
          }
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={24} color="#3D76F7" />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subjectType}>{item.description}</Text>
        </View>

        <TouchableOpacity
          onPress={() => deleteTopic(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="#E53935" />
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Назад</Text>
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

        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push({
              pathname: '/admin/add-topic',
              params: { subjectId: subjectId as string },
            })
          }
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
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
  editButton: { padding: 4 },
  deleteButton: { padding: 4 },
  fab: {
    backgroundColor: '#3D76F7',
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    bottom: 24,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
