import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './screens/LoginScreen';
import CatalogScreen from './screens/CatalogScreen';
import { logout, type AuthUser } from './api/client';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLogout = () => { void logout(); setUser(null); };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Catalog" options={{
            title: `Ciao, ${user.name}`,
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: '#0ea5e9', fontWeight: '700' }}>Esci</Text>
              </TouchableOpacity>
            ),
          }}>
            {() => <CatalogScreen />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {() => <LoginScreen onLogin={setUser} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
