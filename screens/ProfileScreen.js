// import { Button, View, TextInput, Text } from 'react-native';
// import React from 'react';
// import AppStyles from '../styles/AppStyles';
// import { auth, db } from "../firebase"; 
// import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';

// export default function ManageAccount({ navigation }) {
//   let [newPassword, setNewPassword] = React.useState("");
//   let [currentPassword, setCurrentPassword] = React.useState("");
//   let [errorMessage, setErrorMessage] = React.useState("");
//   let logout = () => {
//     signOut(auth).then(() => {
//       navigation.popToTop();
//     });
//   }

//   let updateUserPassword = () => {
//     signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         updatePassword(user, newPassword).then(() => {
//           setNewPassword("");
//           setErrorMessage("");
//           setCurrentPassword("");
//         }).catch((error) => {
//           setErrorMessage(error.message);
//         });
//       })
//       .catch((error) => {
//         setErrorMessage(error.message);
//       });
//   };

//   let deleteUserAndToDos = () => {
//     if (currentPassword === "") {
//       setErrorMessage("Heasbı silmek için önce şifrenizi girmeniz lazım!");
//     } else {
//       signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
//       .then((userCredential) => {
//         const user = userCredential.user;

  
//           deleteUser(user).then(() => {
//             navigation.popToTop();
//           }).catch((error) => {
//             setErrorMessage(error.message);
//           });
//         });

//     }
//   };

//   return (
//     <View style={AppStyles.container}>
//       <Text style={AppStyles.errorText}>{errorMessage}</Text>
//       <TextInput 
//           style={[AppStyles.textInput, AppStyles.darkTextInput]} 
//           placeholder='Current Password'
//           value={currentPassword}
//           secureTextEntry={true}
//           onChangeText={setCurrentPassword} />
//       <TextInput 
//           style={[AppStyles.textInput, AppStyles.darkTextInput]} 
//           placeholder='New Password'
//           value={newPassword}
//           secureTextEntry={true}
//           onChangeText={setNewPassword} />
//       <Button title="Update Password" onPress={updateUserPassword} />
//       <Button title="Delete User" onPress={deleteUserAndToDos} />
//       <Button title="Logout" onPress={logout} />
//       <Button title="Back to ToDos" onPress={() => navigation.pop()} />
//     </View>
//   );
// }

import React, { useState } from 'react';
import { Button, View, TextInput, Text, StyleSheet } from 'react-native';
import { auth } from "../firebase"; 
import { signOut, updatePassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';


export default function ManageAccount({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
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

  const deleteUserAndToDos = () => {
    if (currentPassword === "") {
      setErrorMessage("Hesabı silmek için önce şifrenizi girmeniz lazım!");
    } else {
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
        .then((userCredential) => {
          const user = userCredential.user;

          deleteUser(user).then(() => {
            navigation.popToTop();
          }).catch((error) => {
            setErrorMessage(error.message);
          });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
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
      <Button title="Delete User" onPress={deleteUserAndToDos} />
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
