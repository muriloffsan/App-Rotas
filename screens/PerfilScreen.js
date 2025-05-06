// screens/ProfileScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import { auth } from '../firebase/config';

export default function ProfileScreen() {
  const user = auth.currentUser;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>👤 Perfil</Text>
      <Text>Usuário: {user?.email}</Text>
    </View>
  );
}
