import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity , TextInput} from 'react-native';
import { auth, db } from "../firebase";
import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, query, collection, getDocs, deleteDoc, where } from 'firebase/firestore';
import { Entypo } from '@expo/vector-icons'; // Eklediğimiz icon seti

export default function ManageAccount({ navigation, setUserLoggedIn }) {
  // const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState(""); // Eklenen kısım

  useEffect(() => {
    // Firestore'dan kullanıcı adını çekme
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDocs(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserName(userData.name); // Kullanıcı adını ayarla
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  const logout = async () => {
    try {
      await signOut(auth);
      setUserLoggedIn(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // const updateUserPassword = () => {
  //   signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       updatePassword(user, newPassword).then(() => {
  //         setNewPassword("");
  //         setErrorMessage("");
  //         setCurrentPassword("");
  //       }).catch((error) => {
  //         setErrorMessage(error.message);
  //       });
  //     })
  //     .catch((error) => {
  //       setErrorMessage(error.message);
  //     });
  // };

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
      <View style={styles.header}>
        <Text style={styles.headerText}>{userName}</Text>
        {/* ... (eski kod devam ediyor) */}
      </View>

      <Text style={styles.errorText}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder='Current Password'
        value={currentPassword}
        secureTextEntry={true}
        onChangeText={setCurrentPassword} />
      <Button
        title="Delete Account"
        onPress={deleteUserAndReservation}
        style={styles.deleteButton} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});






// style={styles.input} 
// placeholder='New Password'
// value={newPassword}
// secureTextEntry={true}
// onChangeText={setNewPassword} />
// <Button title="Update Password" onPress={updateUserPassword} />