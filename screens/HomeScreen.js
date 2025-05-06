// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🏠 Home - Bem-vindo!</Text>
      <Button title="Ir para Perfil" onPress={() => navigation.navigate('Profile')} />
      <Button title="Sair" onPress={() => signOut(auth)} />
    </View>
  );
}
