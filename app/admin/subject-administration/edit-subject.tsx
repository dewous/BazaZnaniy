import React, { useState } from 'react';
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

export default function EditSubjectScreen() {
  const { id, name, type, group } = useLocalSearchParams();
  const token = useSelector((state: RootState) => state.auth.token);

  console.log('Получена группа: ', group);

  const [title, setTitle] = useState(name as string);
  const [subjectType, setSubjectType] = useState<'Лекционные' | 'Практические' | 'Лабораторные'>(type as any);
  const [groupName, setGroupName] = useState(
    typeof group === 'string' ? group.split(', ')[0] : ''
  );
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

      const dto = {
        name: title,
        subject_type: subjectType,
        groupNames: [groupName],
      };

      console.log('Отправка данных:', dto);

      const response = await axios.patch(
        `http://baze36.ru:3000/subjects/${id}`,
        dto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', 'Предмет обновлён');
      router.back();
    } catch (error: any) {
      console.error('Ошибка при обновлении:', error);
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

            <Text style={styles.label}>Название предмета</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Название"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Название группы</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Например: 1488"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Тип предмета</Text>
            <Picker
              selectedValue={subjectType}
              onValueChange={(value) => setSubjectType(value as any)}
              style={styles.picker}
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
  },
  backButtonText: {
    color: '#3D76F7',
    fontSize: 16,
  },
});
