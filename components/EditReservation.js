import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditReservation = ({ route, navigation }) => {
  const { reservationId, reservationDetails } = route.params;

  const [editedDetails, setEditedDetails] = useState({
    hotelTitle: reservationDetails.hotelTitle,
    selectedDate: reservationDetails.selectedDate,
    numberOfNights: reservationDetails.numberOfNights.toString(),
    fullName: reservationDetails.fullName,
    phoneNumber: reservationDetails.phoneNumber,
  });

  const handleUpdate = async () => {
    try {
      // Update the reservation details in the database
      await updateDoc(doc(db, 'reservations', reservationId), editedDetails);
      
      // Navigate back to the ReservationsScreen after updating
      navigation.goBack();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Reservation</Text>

      <TextInput
        style={styles.input}
        placeholder="Hotel Title"
        value={editedDetails.hotelTitle}
        onChangeText={(text) => setEditedDetails({ ...editedDetails, hotelTitle: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Selected Date"
        value={editedDetails.selectedDate}
        onChangeText={(text) => setEditedDetails({ ...editedDetails, selectedDate: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Nights"
        keyboardType="numeric"
        value={editedDetails.numberOfNights}
        onChangeText={(text) => setEditedDetails({ ...editedDetails, numberOfNights: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={editedDetails.fullName}
        onChangeText={(text) => setEditedDetails({ ...editedDetails, fullName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={editedDetails.phoneNumber}
        onChangeText={(text) => setEditedDetails({ ...editedDetails, phoneNumber: text })}
      />

      <Button title="Update Reservation" onPress={handleUpdate} />
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
  input: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default EditReservation;
