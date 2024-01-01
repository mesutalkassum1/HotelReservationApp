import React, { useState } from 'react';
import { Button, View, TextInput, Text, StyleSheet } from 'react-native';
import { auth, db } from "../firebase"; 
import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';
import { doc, query, collection, getDocs, deleteDoc, where } from 'firebase/firestore';

export default function ManageAccount({ navigation,setUserLoggedIn }) {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const logout = async () => {
    try {
      await signOut(auth);
      setUserLoggedIn(false)
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const updateUserPassword = () => {
    signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        updatePassword(user, newPassword).then(() => {
          setNewPassword("");
          setErrorMessage("");
          setCurrentPassword("");
        }).catch((error) => {
          setErrorMessage(error.message);
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const deleteUserAndReservation = async () => {
    try {
      if (currentPassword === "") {
        setErrorMessage("Hesabı silmek için önce şifrenizi girmeniz lazım!");
        return;
      }
  
      // Sign in to get user credentials
      const userCredential = await signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword);
      const user = userCredential.user;
  
      // Get the user ID
      const userId = user.uid;
  
      // Delete user from the "users" collection
      await deleteDoc(doc(db, 'users', userId));
  
      // Query reservations collection for reservations by this user
      const reservationsQuery = query(collection(db, 'reservations'), where('userId', '==', userId));
      const reservationsSnapshot = await getDocs(reservationsQuery);
  
      // Delete each reservation
      const deleteReservationsPromises = reservationsSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });




      // Query reservations collection for reservations by this user
      const usersQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const usersSnapshot = await getDocs(usersQuery);
  
      // Delete user
      const deleteUserPromise = usersSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      // Wait for all reservation deletions to complete
      await Promise.all(deleteReservationsPromises);
      await Promise.all(deleteUserPromise)

      // Finally, delete the Firebase Authentication user
      await deleteUser(user);
  
      // Set the user as logged out
      setUserLoggedIn(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Current Password'
        value={currentPassword}
        secureTextEntry={true}
        onChangeText={setCurrentPassword} />
      <TextInput 
        style={styles.input} 
        placeholder='New Password'
        value={newPassword}
        secureTextEntry={true}
        onChangeText={setNewPassword} />
      <Button title="Update Password" onPress={updateUserPassword} />
      <Button title="Delete User" onPress={deleteUserAndReservation} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
