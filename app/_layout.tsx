import { Slot } from 'expo-router';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from '@/lib/UserContext';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function Layout() {
  return (
    <Provider store = { store }>
    <UserProvider>
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay} edges={['top']}>
          <Slot /> 
        </SafeAreaView>  
      </ImageBackground>
      </UserProvider>
      </Provider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
