import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  const userData = {
    nome: 'João da Silva',
    email: 'joao@exemplo.com',
    ultimosDestinos: ['Rio de Janeiro', 'São Paulo', 'Salvador']
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text><Text style={styles.label}>Nome:</Text> {userData.nome}</Text>
      <Text><Text style={styles.label}>Email:</Text> {userData.email}</Text>
      <Text style={[styles.label, { marginTop: 12 }]}>Últimos Destinos:</Text>
      {userData.ultimosDestinos.length > 0 ? (
        userData.ultimosDestinos.map((dest, idx) => (
          <Text key={idx}>• {dest}</Text>
        ))
      ) : (
        <Text>Nenhum destino salvo.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: 'bold' }
});
