import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function AdminPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Панель администратора</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/subject-administration/admin-subject')}>
        <Text style={styles.buttonText}>Управление предметами</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/user-administration/active-users')}>
        <Text style={styles.buttonText}>Редактировать профиль студента</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/profile')}>
        <Text style={styles.buttonText}>Назад</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24,
    backgroundColor: '#F7F9FC',  // Светлый фон для контраста
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center',
    color: '#333',  // Более темный цвет текста для лучшего контраста
  },
  button: {
    backgroundColor: '#3D76F7',  // Контрастный синий цвет
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',  // Тень для выделения кнопки
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,  // Подсветка для Android
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    textAlign: 'center',
    fontWeight: '600',  // Сделать текст жирным для лучшей читаемости
  },
  backButton: {
    backgroundColor: '#FF4D4D',  // Яркий красный для "Назад"
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
