import { Text, View, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


export default function SignUp({ navigation }) {


  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");

  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Şifreler eşleşmiyor!");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  let signUp = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser);
        onLoginSuccess();
        navigation.navigate("HomeScreen", { user: userCredential.user });
      })
      .catch((error) => {
        setValidationMessage(error.message);
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <Text style={styles.header}>Üye ol</Text>
      <Text style={styles.errorText}>{validationMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder='Şifre'
        placeholderTextColor="#BEBEBE"
        secureTextEntry={true}
        value={password}
        onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)}
      />
      <TextInput
        style={styles.input}
        placeholder='Şifrenizi tekrar giriniz'
        placeholderTextColor="#BEBEBE"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)}
      />
      <View style={styles.rowContainer}>
        <Text style={styles.lightText}>Hesabım var </Text>
        <InlineTextButton text="Login" onPress={() => navigation.popToTop()} />
      </View>
      <Button title="Kayıt ol" onPress={signUp} color="#f7b267" />
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
