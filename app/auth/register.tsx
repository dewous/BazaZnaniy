import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useUser } from '../../lib/UserContext';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../../redux/slices/authSlice';

// Типы запроса и ответа
type RegisterRequest = {
  first_name: string;
  last_name: string;
  group_name: string;
  email: string;
  password: string;
  role: 'STUDENT';
};

type RegisterResponse = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    group_name: string;
  };
  access_token: string;
};

export default function Register() {
  const router = useRouter();
  const { setUser } = useUser();
  const dispatch = useDispatch();

  const [firstname, setName] = useState('');
  const [lastname, setSurname] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstname || !lastname || !group || !password || !email) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    const requestData: RegisterRequest = {
      first_name: firstname,
      last_name: lastname,
      group_name: group,
      email,
      password,
      role: 'STUDENT',
    };

    try {
      console.log('Отправка данных регистрации...');
      const response = await axios.post<RegisterResponse>(
        'http://baze36.ru:3000/auth/register/',
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { user } = response.data;

      dispatch(
        setUserData({
          isRegistered: true,
          id: user.id,
          group: user.group_name,
          token: response.data.access_token
        })
      );

      setUser({
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: null,
        role: user.role,
      });

      console.log('Регистрация успешна:', response.data);
      router.replace('/home');
    } catch (error: any) {
      console.error('Ошибка регистрации:', error.response?.data || error.message);
      Alert.alert(
        'Ошибка регистрации',
        error.response?.data?.detail || error.response?.data?.message || 'Произошла ошибка при регистрации.'
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <Text style={styles.title}>Регистрация</Text>

              <TextInput
                style={styles.input}
                placeholder="Имя"
                value={firstname}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Фамилия"
                value={lastname}
                onChangeText={setSurname}
                autoCapitalize="words"
                placeholderTextColor="#999"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Группа, например БПИ-22-РП-1"
                value={group}
                onChangeText={setGroup}
                placeholderTextColor="#999"
                autoCapitalize="characters"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                textContentType="emailAddress"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
                textContentType="password"
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
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
    color: '#333',
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
    textAlign: 'center',
  },
});
