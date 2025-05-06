// loading.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LoadingScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация задержки загрузки (например, запросы на сервер)
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/startpage'); // После завершения загрузки редиректим на главную страницу
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3D76F7" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return null; // Ничего не рендерим, если загрузка завершена
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingScreen;
