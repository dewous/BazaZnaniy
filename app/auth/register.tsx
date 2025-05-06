import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';

export default function Register() {
  const router = useRouter();

  // Состояния для хранения значений полей формы
  const [firstname, setName] = useState('');
  const [lastname, setSurname] = useState('');
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');

  // Функция для обработки регистрации
  const handleRegister = () => {
    if (!firstname || !lastname || !group || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    
    console.log('Зарегистрирован:', { firstname, lastname, group, password });
    
    // После успешной регистрации можно перенаправить на главный экран
    router.replace('/home');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Регистрация</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Имя"
          value={firstname}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor={"#999"}
        />

        <TextInput
          style={styles.input}
          placeholder="Фамилия"
          value={lastname}
          onChangeText={setSurname}
          autoCapitalize="words"
          placeholderTextColor={"#999"}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Группа, например БПИ-22-РП-1"
          value={group}
          onChangeText={setGroup}
          placeholderTextColor={"#999"}
          autoCapitalize='characters'
        />
        
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={"#999"}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => router.replace('../auth/login')}
        >
          <Text style={styles.switchButtonText}>Есть аккаунт? Войти</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)', // полупрозрачный фон для лучшего контраста
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333'
  },
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: '#3D76F7',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
});
