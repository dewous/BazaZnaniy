import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function AddUserScreen() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [role, setRole] = useState('STUDENT'); // По умолчанию роль "STUDENT"
  const [password, setPassword] = useState(''); // Новый стейт для пароля
  const [loading, setLoading] = useState(false);

  // Функция для автоматической заглавной первой буквы
  const capitalizeFirstLetter = (text: string) => {
    console.log('Capitalize input text:', text); // Логирование входного текста
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleSubmit = async () => {
    console.log('Submitting form with data:', { firstName, lastName, email, group, role, password });

    // Обрезаем пробелы
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedGroup = group.trim();
    const trimmedPassword = password.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedGroup || !role || !trimmedPassword) {
      Alert.alert('Ошибка', 'Все поля должны быть заполнены');
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать хотя бы 6 символов');
      return;
    }

    try {
    setLoading(true);
    console.log('Запрос к серверу....');

    const response = await axios.post(
        'http://baze36.ru:3000/auth/register/',
        {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        email: trimmedEmail,
        group_name: trimmedGroup,
        password: trimmedPassword, // Передаем пароль
        role, // Передаем роль
        },
        {
        headers: { 'Content-Type': 'application/json' },
        },
    );

    console.log('Ответ сервера...', response.data);
    Alert.alert('Успех', 'Пользователь успешно добавлен');
    router.push('/admin/user-administration/active-users');
    } catch (error: any) {
    console.error('Ошибка:', error.response?.data || error.message);
    Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось добавить пользователя');
    } finally {
    setLoading(false);
    console.log('Окончание запроса, загрузка:', loading);
    }

  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* Оборачиваем в TouchableWithoutFeedback, чтобы скрыть клавиатуру при нажатии на пустое место */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Назад</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите имя"
                placeholderTextColor="#aaa"
                value={firstName}
                onChangeText={(text) => {
                  console.log('First name input changed:', text); // Логирование изменения имени
                  setFirstName(capitalizeFirstLetter(text));
                }}
              />

              <Text style={styles.label}>Фамилия</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите фамилию"
                placeholderTextColor="#aaa"
                value={lastName}
                onChangeText={(text) => {
                  console.log('Last name input changed:', text); // Логирование изменения фамилии
                  setLastName(capitalizeFirstLetter(text));
                }}
                autoCorrect={false}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                autoCapitalize="none"
                onChangeText={(text) => {
                  console.log('Email input changed:', text); // Логирование изменения email
                  setEmail(text);
                }}
                autoCorrect={false}
              />

              <Text style={styles.label}>Группа</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите группу"
                placeholderTextColor="#aaa"
                value={group}
                autoCapitalize="characters"
                onChangeText={(text) => {
                  console.log('Group input changed:', text); // Логирование изменения группы
                  setGroup(text);
                }}
                autoCorrect={false}
              />

              <Text style={styles.label}>Пароль</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите пароль"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  console.log('Password input changed:', text); // Логирование изменения пароля
                  setPassword(text);
                }}
              />

              <Text style={styles.label}>Роль</Text>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => {
                  console.log('Role changed:', itemValue); // Логирование изменения роли
                  setRole(itemValue);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Студент" value="STUDENT" />
                <Picker.Item label="Преподаватель" value="TEACHER" />
                <Picker.Item label="Администратор" value="ADMIN" />
              </Picker>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Сохранение...' : 'Добавить пользователя'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    padding: 1,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  pickerItem: {
    color: '#000',
  },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
  },
});
