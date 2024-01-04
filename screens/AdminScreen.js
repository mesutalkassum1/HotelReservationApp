// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { getFirestore, collection, getDocs, deleteDoc, doc , query, where } from 'firebase/firestore';
// import { auth } from 'firebase/auth';
// import { deleteUser as deleteAuthUser } from 'firebase/auth';


// const AdminScreen = () => {
//   const [users, setUsers] = useState([]);
//   const db = getFirestore();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersCollectionRef = collection(db, 'users');
//         const usersSnapshot = await getDocs(usersCollectionRef);

//         // Map through the documents and extract user data
//         const userData = usersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setUsers(userData);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, [db]);
//   const handleDeleteUser = async (userId, userEmail) => {
//     try {
//       const confirmDelete = await promptConfirmation();
//       if (confirmDelete) {
//         // Delete user's reservations from Firestore (reservations collection)
//         const reservationsCollectionRef = collection(db, 'reservations');
//         const reservationsQuerySnapshot = await getDocs(
//           query(reservationsCollectionRef, where('userId', '==', userId))
//         );
  
//         // Delete each reservation
//         const deleteReservationsPromises = reservationsQuerySnapshot.docs.map(async (reservationDoc) => {
//           await deleteDoc(reservationDoc.ref);
//         });
  
//         await Promise.all(deleteReservationsPromises);
  
//         // Delete user's data from Firestore (users collection)
//         const userDocRef = doc(collection(db, 'users'), userId);
//         await deleteDoc(userDocRef);
  
//         // Update the users state to reflect the changes
//         const updatedUsers = users.filter((user) => user.id !== userId);
//         setUsers(updatedUsers);
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };
  
  
  
//   const getUserByEmail = async (email) => {
//     const usersCollectionRef = collection(db, 'users');
//     const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', email)));
//     const userDoc = querySnapshot.docs[0];
    
//     if (userDoc) {
//       const userData = userDoc.data();
//       return { uid: userDoc.id, ...userData };
//     }
  
//     return null;
//   };
  
  
  
  

//   const promptConfirmation = () => {
//     return new Promise((resolve) => {
//       Alert.alert(
//         'Confirm Deletion',
//         'Are you sure you want to delete this user?',
//         [
//           {
//             text: 'Cancel',
//             onPress: () => resolve(false),
//             style: 'cancel',
//           },
//           {
//             text: 'Delete',
//             onPress: () => resolve(true),
//             style: 'destructive',
//           },
//         ],
//         { cancelable: false }
//       );
//     });
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.userItem}>
//       <Text style={styles.userId}>{`User ID: ${item.id}`}</Text>
//       <Text style={styles.userInfo}>{`Email: ${item.email}`}</Text>
//       <Text style={styles.userInfo}>{`Name: ${item.name}`}</Text>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => handleDeleteUser(item.id, item.email)}
//       >
//         <Text style={styles.deleteButtonText}>Delete User</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Welcome Admin!</Text>
//       {users.length > 0 ? (
//         <FlatList
//           data={users}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//         />
//       ) : (
//         <Text>No users found.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subheading: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   userItem: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 15,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },
//   userId: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   userInfo: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   deleteButtonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
// });

// export default AdminScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const userData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [db]);

  // const handleDeleteUser = async (userId, userEmail) => {
  //   try {
  //     const confirmDelete = await promptConfirmation();
  //     if (confirmDelete) {
  //       console.log('Deleting reservations and user:', userId);
  //       // Delete user's reservations from Firestore (reservations collection)
  //       await deleteReservations(userId);
  
  //       // Delete user's data from Firestore (users collection)
  //       await deleteUser(userId);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };
  

  // const deleteReservations = async (userId) => {
  //   try {
  //     console.log('Deleting reservations for user:', userId);
  
  //     const reservationsCollectionRef = collection(db, 'reservations');
  //     const reservationsQuerySnapshot = await getDocs(query(reservationsCollectionRef, where('userId', '==', userId)));
  
  //     const deleteReservationsPromises = reservationsQuerySnapshot.docs.map(async (reservationDoc) => {
  //       console.log('Deleting reservation:', reservationDoc.id);
  //       await deleteDoc(reservationDoc.ref);
  //     });
  
  //     await Promise.all(deleteReservationsPromises);
  
  //     console.log('Reservations deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting reservations:', error);
  //   }
  // };

  // const deleteUser = async (userId) => {
  //   try {
  //     const userDocRef = doc(collection(db, 'users'), userId);
  //     await deleteDoc(userDocRef);

  //     // Update the users state to reflect the changes
  //     const updatedUsers = users.filter((user) => user.id !== userId);
  //     setUsers(updatedUsers);
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  // const promptConfirmation = () => {
  //   return new Promise((resolve) => {
  //     Alert.alert(
  //       'Confirm Deletion',
  //       'Are you sure you want to delete this user?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => resolve(false),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Delete',
  //           onPress: () => resolve(true),
  //           style: 'destructive',
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   });
  // };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userId}>{`User ID: ${item.id}`}</Text>
      <Text style={styles.userInfo}>{`Email: ${item.email}`}</Text>
      <Text style={styles.userInfo}>{`Name: ${item.name}`}</Text>
      {/* <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.id, item.email)}
      >
        <Text style={styles.deleteButtonText}>Delete User</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Admin!</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No users found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AdminScreen;
