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

interface SubjectGroup {
    groupName: string;
    // Можно добавить другие поля, если нужно
  }
  
  interface SubjectCard {
    id: string;
    name: string;
    subject_type: 'Лекционные' | 'Практические' | 'Лабораторные';
    subjectGroups: SubjectGroup[]; // Добавляем связь с группами
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
    console.log(JSON.stringify(res.data, null, 2));

    // Преобразуем данные так, чтобы извлечь только нужные свойства
    const subjects = res.data.map((subject: any) => ({
      id: subject.id,
      name: subject.name,
      subject_type: subject.subject_type,
      subjectGroups: subject.subjectGroups ?? [], // Преобразуем массив групп в строку
    }));

    setSubjects(subjects);
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
    Alert.alert('Удалить предмет?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://baze36.ru:3000/subjects/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSubjects(prev => prev.filter(subject => subject.id !== id));
          } catch (error: any) {
            Alert.alert('Ошибка', 'Не удалось удалить предмет');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: SubjectCard }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Кнопка редактирования предмета */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/admin/subject-administration/edit-subject',
              params: { id: item.id, name: item.name, type: item.subject_type, group: item.subjectGroups.map((g) => g.groupName).join(', ') },
            })
          }
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={24} color="#3D76F7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textContainer}
          onPress={() =>
            router.push({
              pathname: '/admin/subject-administration/edit-subject',
              params: { id: item.id, name: item.name, type: item.subject_type, group: item.subjectGroups.map((g) => g.groupName).join(', ') },
            })
          }
        >
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subjectType}>{item.subject_type}</Text>
          <Text style={styles.subjectType}> {item.subjectGroups?.map((g) => g.groupName).join(', ') ?? 'Без группы'}</Text>
        </TouchableOpacity>

        {/* Иконка мусорки */}
        <TouchableOpacity
          onPress={() => deleteSubject(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="#E53935" />
        </TouchableOpacity>
      </View>

      {/* Кнопка для перехода к темам */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.viewTopicsButton}
          onPress={() =>
            router.push({
                pathname: '/admin/topic-administration/admin-topic',
                params: { subjectId: item.id, subjectName: item.name }
            })
          }
        >
          <Text style={styles.viewTopicsText}>Просмотр тем</Text>
        </TouchableOpacity>
      </View>
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
          onPress={() => router.push('/admin/subject-administration/add-subject')}
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
    flexDirection: 'column', // изменено для выравнивания текста и кнопок
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  bottomButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  viewTopicsButton: {
    backgroundColor: '#3D76F7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  viewTopicsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
