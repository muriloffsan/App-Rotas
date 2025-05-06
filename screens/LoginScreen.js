// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Usuário logado:", cred.user);
      navigation.navigate("Home"); // redireciona para a tela principal
    } catch (err) {
      console.error("Erro no login:", err.message);
      setErro("Email ou senha inválidos");
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f0f0f0' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, borderColor: '#ccc', borderWidth: 1 },
  button: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#007bff', textAlign: 'center', marginTop: 10 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' }
});
