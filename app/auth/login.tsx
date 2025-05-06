import { useRouter } from 'expo-router';
import { View, Button, Text } from 'react-native';

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login screen</Text>
      <Button title="Войти" onPress={() => router.replace('/home')} />
    </View>
  );
}
