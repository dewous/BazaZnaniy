import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function AdminPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Панель администратора</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/admin-subject')}>
        <Text style={styles.buttonText}>Управление предметами</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/edit-subject')}>
        <Text style={styles.buttonText}>Редактировать карточку предмета</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/edit-user')}>
        <Text style={styles.buttonText}>Редактировать профиль студента</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/edit-topic')}>
        <Text style={styles.buttonText}>Редактировать карточки тем</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/profile')}>
        <Text style={styles.buttonText}>Назад</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
  backButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  }
});
