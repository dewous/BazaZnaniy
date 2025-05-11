import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function EditUserScreen() {
  const { id, first_name, last_name, email, group, role } = useLocalSearchParams();

  const token = useSelector((state: RootState) => state.auth.token);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [userRole, setUserRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (first_name) setFirstName(first_name as string);
    if (last_name) setLastName(last_name as string);
    if (email) setUserEmail(email as string);
    if (group) setGroupName(group as string);
    if (role) setUserRole(role as 'STUDENT' | 'TEACHER' | 'ADMIN');
  }, [first_name, last_name, email, group, role]);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !userEmail.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);

      const dto = {
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        group_name: groupName,
        role: userRole,
      };

      await axios.patch(
        `http://baze36.ru:3000/auth/${id}`,
        dto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', 'Данные пользователя обновлены');
      router.back();
    } catch (error: any) {
      console.error('Ошибка при обновлении:', {
        message: error.message,
        responseData: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        requestData: error.config?.data,
        requestUrl: error.config?.url,
        method: error.config?.method,
      });

      Alert.alert('Ошибка', error.response?.data?.message || 'Ошибка при обновлении');
    } finally {
      setLoading(false);
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Имя"
              placeholderTextColor="#aaa"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Фамилия"
              placeholderTextColor="#aaa"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="example@mail.com"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Группа</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="1488"
              placeholderTextColor="#aaa"
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <Text style={styles.label}>Роль</Text>
            <Picker
              selectedValue={userRole}
              onValueChange={(value) => setUserRole(value as 'STUDENT' | 'TEACHER' | 'ADMIN')}
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
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
    marginBottom: 20,
  },
  pickerItem: {
    color: 'black'
  },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
  },
});
