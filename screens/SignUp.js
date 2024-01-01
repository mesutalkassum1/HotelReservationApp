import { Text, View, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import { auth, db } from "../firebase";
import { collection, addDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


export default function SignUp({ navigation }) {


  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");
  let [name, setName] = React.useState("");


  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Şifreler veya email eşleşmiyor!");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  let signUp = () => {
    if (password === confirmPassword && email && name) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Save additional user information to the database
          saveUserInformation(userCredential.user);
  
          sendEmailVerification(auth.currentUser);
          onLoginSuccess();
          navigation.navigate("HomeScreen", { user: userCredential.user });
        })
        .catch((error) => {
          setValidationMessage(error.message);
        });
    }
  };

  let saveUserInformation = async (user) => {
    try {
      // Assuming the user is authenticated and user ID is available
      const userId = user.uid;

      // Create a reference to the "users" collection
      const usersCollectionRef = collection(db, 'users');

      // Add a new document with a generated ID
      await addDoc(usersCollectionRef, {
        userId: userId,
        email: email,
        name: name,
      });
    } catch (error) {
      console.error('Error saving user information:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.errorText}>{validationMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder='Full Name'
        placeholderTextColor="#BEBEBE"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        placeholderTextColor="#BEBEBE"
        secureTextEntry={true}
        value={password}
        onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter Password Again'
        placeholderTextColor="#BEBEBE"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)}
      />
      <View style={styles.rowContainer}>
        <Text style={styles.lightText}>Have account already? </Text>
        <InlineTextButton text="Login" onPress={() => navigation.popToTop()} />
      </View>
      <Button title="Sign Up" onPress={signUp} color="#f7b267" />
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
