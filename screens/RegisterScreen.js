import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      console.log("Usuário autenticado:", cred.user.uid);

      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nome: nome,
        email: email,
        ultimosDestinos: [],
        criadoEm: new Date()
      });

      Alert.alert("Cadastro feito com sucesso!");
      navigation.navigate("Login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err.message);
      setErro("Erro ao cadastrar: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <Button title="Cadastrar" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>Voltar para Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 5, backgroundColor: '#fff' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  link: { marginTop: 12, color: '#007bff', textAlign: 'center' },
});
