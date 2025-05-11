import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../../redux/slices/authSlice';
import { router } from 'expo-router';
import { RootState } from '@/redux/store';
import axios from 'axios';

interface UserData {
  first_name: string;
  last_name: string;
  avatar: string | null;
  group_name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.id);
  const groupName = useSelector((state: RootState) => state.auth.group);
  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [group, setGroup] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        if (!token) throw new Error('Токен не найден');

        const res = await axios.get(`http://baze36.ru:3000/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAvatar(data.avatar || null);
        setGroup(groupName ?? '');
        setRole(data.role);
      } catch (error: any) {
        console.error(error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Разрешение', 'Нужно разрешение на доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!token) throw new Error('Токен не найден');

      const body: any = {
        first_name: firstName,
        last_name: lastName,
        group_name: group,
        avatar,
      };

      if (newPassword) {
        body.old_password = oldPassword;
        body.new_password = newPassword;
      }

      await axios.patch(`http://baze36.ru:3000/auth/me`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Сохранено', 'Ваш профиль обновлён');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось сохранить изменения');
    }
  };

  const handleLogout = () => {
    Alert.alert('Выход из аккаунта', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          dispatch(resetUser());
          router.replace('/');
        },
      },
    ]);
  };

  const handleDeleteProfile = () => {
    Alert.alert('Удаление профиля', 'Вы уверены, что хотите удалить профиль? Это действие необратимо.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            if (!token) throw new Error('Токен не найден');

            await axios.delete(`http://baze36.ru:3000/auth/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert('Удалено', 'Ваш профиль успешно удалён');
            dispatch(resetUser());
            router.replace('/');
          } catch (error: any) {
            console.error(error);
            Alert.alert('Ошибка', 'Не удалось удалить профиль');
          }
        },
      },
    ]);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={pickAvatar}>
              <Image
                source={avatar ? { uri: avatar } : require('../../assets/images/avatar.jpg')}
                style={styles.avatar}
              />
              <Text style={styles.changeAvatarText}>Изменить аватар</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#999"
                autoCapitalize='words'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Фамилия</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#999"
                autoCapitalize='words'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Группа</Text>
              <TextInput
                style={styles.input}
                value={group}
                onChangeText={setGroup}
                placeholderTextColor="#999"
                textContentType='oneTimeCode'
                autoCapitalize='characters'
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Старый пароль</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Старый пароль"
                placeholderTextColor="#999"
                textContentType='oneTimeCode'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Новый пароль</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Новый пароль"
                  placeholderTextColor="#999" 
                />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#888"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Сохранить изменения</Text>
            </TouchableOpacity>

            {role === 'ADMIN' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#28A745', marginTop: 12 }]}
                onPress={() => router.push('/admin/admin-panel')}
              >
                <Text style={styles.buttonText}>Панель администратора</Text>
              </TouchableOpacity>
            )}

            <View style={styles.rowButtons}>
              <TouchableOpacity style={[styles.smallButton, { backgroundColor: 'red' }]} onPress={handleDeleteProfile}>
                <Text style={styles.buttonText}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#3D76F7' }]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Выйти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    alignSelf: 'center', marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 14, color: '#3D76F7',
    marginBottom: 20, textAlign: 'center',
  },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: '500', color: '#222' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222', // Более тёмный цвет текста
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center' },
  eyeIcon: { marginLeft: 8 },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
  },
  smallButton: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 16,
    width: '48%',
  },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center', fontWeight: '600' },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 350 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
