import { Text, View, TextInput, ImageBackground, Button, KeyboardAvoidingView, Platform } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import App from '../App'

export default function Login({ navigation, setUserLoggedIn  }) {

  if (auth.currentUser) {
    setUserLoggedIn(true);

  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } });
  }

  const[errorMessage, setErrorMessage] = React.useState("");
  const[email, setEmail] = React.useState("");
  const[password, setPassword] = React.useState("");

  let login = async () => {
    if (email !== "" && password !== "") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setErrorMessage("");
        setEmail("");
        setPassword("");
        setUserLoggedIn(true);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("Lütfen bir Email ve Şifre giriniz");
    }
  }
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <Text style={styles.header}>Giriş</Text>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={(value)=>setEmail(value)}
      />
      <TextInput
        style={styles.input}
        placeholder='Şifre'
        placeholderTextColor="#BEBEBE"
        secureTextEntry={true}
        value={password}
        onChangeText={(value)=>setPassword(value)}
      />
      <View style={styles.rowContainer}>
        <Text style={styles.lightText}>Hesabım Yok </Text>
        <InlineTextButton text="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.lightText}>Şifremi Unuttum </Text>
        <InlineTextButton text="Reset" onPress={() => navigation.navigate("ResetPassword")} />
      </View>
      <Button title="Login" onPress={login} color="#f7b267" />
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#BEBEBE',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lightText: {
    color: '#BEBEBE',
  },
};