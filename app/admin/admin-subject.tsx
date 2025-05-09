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
      const res = await axios.get('http://baze36.ru:3000/subject', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjects(res.data);
    } catch (error: any) {
      console.error('Ошибка при загрузке предметов', error);
      Alert.alert('Ошибка', 'Не удалось загрузить предметы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const deleteSubject = async (id: string) => {
    Alert.alert('Удалить предмет?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://baze36.ru:3000/subject/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSubjects(subjects.filter(subject => subject.id !== id));
          } catch (error: any) {
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
        <Text style={styles.delete}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://your-background-image-url.com' }}
      style={styles.container}
    >
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
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/admin/add-subject')}
      >
        <Text style={styles.addButtonText}>Добавить новый предмет</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Назад</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'flex-start' },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: 'black' },
  emptyText: { fontSize: 16, textAlign: 'center', color: 'black', marginTop: 32 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '500', color: 'black' },
  subjectType: { fontSize: 14, color: 'black', marginTop: 4 },
  delete: { color: '#E53935', fontWeight: '500' },
  addButton: {
    backgroundColor: '#3D76F7',
    padding: 16,
    borderRadius: 16,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  addButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
  },
});

