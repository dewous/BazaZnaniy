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
import { router } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SubjectCard {
  id: string;
  name: string;
  subject_type: 'Лекционные' | 'Практические' | 'Лабораторные';
}

export default function AdminSubjectsPanel() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [subjects, setSubjects] = useState<SubjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://baze36.ru:3000/subjects/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (error: any) {
      Alert.alert('Ошибка', 'Не удалось загрузить предметы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const deleteSubject = async (id: string) => {
    console.log(`[Удаление] Инициировано удаление предмета с ID: ${id}`);
  
    Alert.alert('Удалить предмет?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel', onPress: () => console.log('[Удаление] Отмена пользователем') },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log(`[Удаление] Отправка запроса DELETE на /subjects/${id}`);
            await axios.delete(`http://baze36.ru:3000/subjects/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`[Удаление] Успешно удалён предмет с ID: ${id}`);
            setSubjects(prev => prev.filter(subject => subject.id !== id));
          } catch (error: any) {
            console.error(`[Удаление] Ошибка при удалении предмета с ID: ${id}`, error);
            Alert.alert('Ошибка', 'Не удалось удалить предмет');
          }
        },
      },
    ]);
  };
  const renderItem = ({ item }: { item: SubjectCard }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subjectType}>{item.subject_type}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteSubject(item.id)}>
        <Ionicons name="trash-outline" size={22} color="#E53935" />
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3D76F7" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Карточки предметов</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3D76F7" />
        ) : subjects.length === 0 ? (
          <Text style={styles.emptyText}>Не добавлено ни одной карточки</Text>
        ) : (
          <FlatList
            data={subjects}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/admin/add-subject')}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)', // прозрачный белый фон
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
    marginTop: 0.1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  subjectType: {
    fontSize: 14,
    color: '#6e6e6e',
    marginTop: 4,
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
