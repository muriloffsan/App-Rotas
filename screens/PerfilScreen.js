import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const docRef = doc(db, 'usuarios', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    };
    fetchUser();
  }, []);

  if (!userData) return <Text style={styles.loading}>Carregando perfil...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text><Text style={styles.label}>Nome:</Text> {userData.nome}</Text>
      <Text><Text style={styles.label}>Email:</Text> {userData.email}</Text>
      <Text style={styles.label}>Últimos Destinos:</Text>
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
  container: { padding: 20, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: 'bold' }
});
