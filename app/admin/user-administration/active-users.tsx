import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'expo-router';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  group_name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export default function AdminUsersPanel() {
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    console.log('[AdminUsersPanel] Загрузка списка пользователей...');
    try {
      const res = await axios.get('http://baze36.ru:3000/auth/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[AdminUsersPanel] Пользователи загружены:', res.data);
      setUsers(res.data);
    } catch (error) {
      console.error('[AdminUsersPanel] Ошибка при загрузке пользователей:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    Alert.alert('Удалить пользователя?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          console.log(`[AdminUsersPanel] Удаление пользователя с ID: ${id}`);
          try {
            await axios.delete(`http://baze36.ru:3000/auth/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsers((prev) => prev.filter((user) => user.id !== id));
            console.log('[AdminUsersPanel] Пользователь удалён успешно');
          } catch (error) {
            console.error('[AdminUsersPanel] Ошибка при удалении пользователя:', error);
            Alert.alert('Ошибка', 'Не удалось удалить пользователя');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>
            id: {item.id}: {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.userEmail}>e-mail: {item.email}</Text>
          <Text style={styles.userGroup}>Группа: {item.group_name}</Text>
          <Text style={styles.userEmail}>Роль: {item.role}</Text>
        </View>

        <View style={styles.iconButtons}>
          <TouchableOpacity
            onPress={() => {
              console.log(`[AdminUsersPanel] Переход к редактированию пользователя ${item.id} с группой ${item.group_name}`);
              router.push({
                pathname: '/admin/user-administration/edit-user',
                params: {     id: item.id,
                              first_name: item.first_name,
                              last_name: item.last_name,
                              email: item.email,
                              group: item.group_name,
                              role: item.role, },
              });
            }}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={24} color="#3D76F7" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteUser(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={28} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => {
        console.log('[AdminUsersPanel] Возврат назад');
        router.back();
      }}>
        <Ionicons name="arrow-back" size={20} color="#3D76F7" />
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Пользователи</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3D76F7" />
      ) : users.length === 0 ? (
        <Text style={styles.emptyText}>Пользователи не найдены</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log('[AdminUsersPanel] Переход к добавлению пользователя');
          router.push('/admin/user-administration/add-user');
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeader: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  userEmail: {
    fontSize: 14,
    color: '#6e6e6e',
  },
  userGroup: {
    fontSize: 14,
    color: '#6e6e6e',
    marginTop: 4,
  },
  iconButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
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
});