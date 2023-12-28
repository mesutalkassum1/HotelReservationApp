import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';

import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import EditReservation from '../components/EditReservation';

const ReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = useCallback(async () => {
    try {
      const userId = auth.currentUser.uid;

      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(reservationsQuery);

      const userReservations = [];
      querySnapshot.forEach((doc) => {
        userReservations.push({ id: doc.id, ...doc.data() });
      });

      setReservations(userReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };


  const handleDeleteReservation = async (reservationId) => {
    try {
      // Confirm deletion with an alert
      Alert.alert(
        'Delete Reservation',
        'Are you sure you want to delete this reservation?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await deleteDoc(doc(db, 'reservations', reservationId));
              // Remove the deleted reservation from the state
              setReservations((prevReservations) =>
                prevReservations.filter((reservation) => reservation.id !== reservationId)
              );
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleUpdateReservation = (reservationId, reservationDetails) => {
    // Navigate to the EditReservationScreen, passing the reservation details
    navigation.navigate('EditReservation', { reservationId, reservationDetails });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reservations</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.reservationItem}>
              <Text style={styles.hotelText}>{item.hotelTitle}</Text>
              <Text style={styles.detailText}>Date: {item.selectedDate}</Text>
              <Text style={styles.detailText}>Nights: {item.numberOfNights}</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateReservation(item.id, item)}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteReservation(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReservationsText}>No reservations found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3498db',
    textAlign: 'center',
  },
  reservationItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  hotelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3498db',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  noReservationsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ReservationsScreen;
