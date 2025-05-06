import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const StartPage: React.FC = () => {
  const router = useRouter();
  const isAuth = useSelector((state: RootState) => state.auth.isRegistered);

  // Редирект, если пользователь авторизован
  useEffect(() => {
    if (isAuth) {
      console.log("user authorized")
      router.push('/home');
    }
  }, [isAuth, router]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/goose.png')} style={styles.image} />
      <Text style={styles.title}>База знаний</Text>
      <Text style={styles.description}>
        Этот производительный инструмент, разработанный для того, чтобы помочь вам лучше и удобнее управлять своими задачами в рамках учебы.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => router.push('/auth/register')}
      >
        <Text style={styles.switchButtonText}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3D76F7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  switchButtonText: {
    fontSize: 16,
    color: '#3D76F7',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default StartPage;