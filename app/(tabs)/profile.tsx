import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '../../lib/UserContext';

export default function ProfileScreen() {
  const { user, setUser } = useUser();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAvatar(user.avatar);
  }, [user]);


  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Разрешение', 'Нужно разрешение на доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setUser({ firstName, lastName, avatar });
    Alert.alert('Сохранено', 'Ваш профиль обновлён');
  };

  return (
   <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
   >
      <View style={styles.container}>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            source={
              avatar ? { uri: avatar } : require('../../assets/images/avatar.jpg')
            }
            style={styles.avatar}
          />
          <Text style={styles.changeAvatarText}>Изменить аватар</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            placeholder="Имя"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={"#999"}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Фамилия</Text>
          <TextInput
            style={styles.input}
            placeholder="Фамилия"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={"#999"}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Группа</Text>
          <TextInput
            style={styles.input}
            placeholder="Группа"
            value={group}
            onChangeText={setGroup}
            placeholderTextColor={"#999"}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Новый пароль</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Новый пароль"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={"#999"}
            />
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#888"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Сохранить изменения</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 12 }]}
          onPress={() => {
            Alert.alert(
              'Выход из аккаунта',
              'Вы уверены, что хотите выйти?',
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Выйти',
                  style: 'destructive',
                  onPress: () => router.replace('/'),
                },
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={styles.buttonText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

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

  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 14,
    color: '#3D76F7',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: 8,
  },
});
