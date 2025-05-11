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
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function AddSubjectScreen() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [title, setTitle] = useState('');
  const [groupName, setGroupName] = useState('');
  const [subjectType, setSubjectType] = useState<'Лекционные' | 'Практические' | 'Лабораторные'>('Лекционные');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название предмета');
      return;
    }
  
    if (!groupName.trim()) {
      Alert.alert('Ошибка', 'Введите название группы');
      return;
    }
  
    try {
      setLoading(true);
      console.log('Отправка запроса с данными:');
      console.log('TOKEN:', token);
      console.log('TITLE:', title);
      console.log('GROUP NAME:', groupName);
      console.log('SUBJECT TYPE:', subjectType);
  
      // Запрос на сервер
      const response = await axios.post(
        'http://baze36.ru:3000/subjects',
        {
          name: title,
          subject_type: subjectType,
          groupNames: [groupName],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log('Ответ от сервера:', response.data);
  
      Alert.alert('Успех', 'Предмет успешно добавлен');
      router.back();
    } catch (error: any) {
      console.error('Ошибка при отправке запроса:', error);
      // Логируем подробности ошибки
      if (error.response) {
        console.error('Ответ сервера с ошибкой:', error.response.data);
      } else {
        console.error('Ошибка без ответа от сервера:', error.message);
      }
  
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось создать предмет');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectTypeChange = (itemValue: 'Лекционные' | 'Практические' | 'Лабораторные') => {
    setSubjectType(itemValue);
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Название предмета</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Биология"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Название группы</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: 1488"
              value={groupName}
              onChangeText={setGroupName}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Тип предмета</Text>
            <Picker
              selectedValue={subjectType}
              onValueChange={handleSubjectTypeChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Лекционные" value="Лекционные" />
              <Picker.Item label="Практические" value="Практические" />
              <Picker.Item label="Лабораторные" value="Лабораторные" />
            </Picker>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Сохранение...' : 'Сохранить'}
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
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
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
