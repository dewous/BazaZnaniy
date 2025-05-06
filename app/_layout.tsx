import { Slot } from 'expo-router';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay} edges={['top']}>
          <Slot /> 
        </SafeAreaView>  
      </ImageBackground>
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
