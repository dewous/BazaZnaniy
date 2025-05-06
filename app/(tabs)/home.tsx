import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native';
import { useUser } from '../../lib/UserContext';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require('../../assets/images/avatar.jpg')
            }
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Добро пожаловать!</Text>
          <Text style={styles.name}>
            {user?.firstName || ''} {user?.lastName || ''}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Здесь появится ваш контент позже</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
