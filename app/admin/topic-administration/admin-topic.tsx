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
  content: string;
  description: string;
}

export default function AdminTopicsPanel() {
  const { subjectId, subjectName } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
  }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`http://baze36.ru:3000/cards/by-subject`, {
        params: { subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(res.data);
    } catch (error: any) {
      Alert.alert('Ошибка', 'Не удалось загрузить темы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

const deleteTopic = async (id: string) => {
  Alert.alert('Удалить тему?', 'Это действие нельзя отменить.', [
    { text: 'Отмена', style: 'cancel' },
    {
      text: 'Удалить',
      style: 'destructive',
      onPress: async () => {
        try {
          // Изменяем URL запроса, используя параметр id в пути
          await axios.delete(`http://baze36.ru:3000/cards/by-id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTopics((prev) => prev.filter((topic) => topic.id !== id));
        } catch (error: any) {
          Alert.alert('Ошибка', 'Не удалось удалить тему');
        }
      },
    },
  ]);
};


  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subjectType}>{item.description}</Text>
        </View>

        <View style={styles.iconButtons}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/admin/topic-administration/edit-topic',
                params: {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  content: item.content,
                  subjectId,
                },
              })
            }
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#3D76F7" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteTopic(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={28} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/admin/topic-administration/topic-content',
            params: {
                  topicId: item.id,
                  title: item.title,
                  description: item.description,
                   content: item.content,
                  subjectId,
            },
          })
        }
        style={styles.viewContentButton}
      >
        <Text style={styles.viewContentButtonText}>Просмотреть содержимое темы</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
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
              pathname: '/admin/topic-administration/add-topic',
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
  iconButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
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
