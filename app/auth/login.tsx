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
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/redux/slices/authSlice';
import { useUser } from '../../lib/UserContext';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://baze36.ru:3000/auth/login', {
        email,
        password,
      });

      const { access_token, userId, group_name } = response.data;


      // Устанавливаем в Redux
      dispatch(setUserData({
        isRegistered: true,
        id: userId.toString(),
        token: access_token,
        group: group_name || 'default',
      }));

      console.log('Успешный логин:', response.data);
      router.replace('/home');
    } catch (error: any) {
      console.error('Ошибка логина:', error.response?.data || error.message);
      Alert.alert('Ошибка авторизации', error.response?.data?.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
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
              <Text style={styles.title}>Вход</Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Входим...' : 'Войти'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => router.replace('../auth/register')}
              >
                <Text style={styles.switchButtonText}>Нет аккаунта? Зарегистрироваться</Text>
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
