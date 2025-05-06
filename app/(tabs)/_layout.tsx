import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider } from '../../lib/UserContext'; // убедись, что путь правильный

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: '#3D76F7',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Главная',
            tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="subjects"
          options={{
            title: 'Предметы',
            tabBarIcon: ({ color, size }) => <Ionicons name="albums-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
