import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, doc, setDoc } from 'firebase/firestore';

import { db } from '../firebase';

const ReservationScreen = ({ route }) => {
  const { hotel } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [numberOfNights, setNumberOfNights] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleReservationConfirmation = async () => {
    try {
      const reservationCollectionRef = collection(db, 'reservations');
      const newReservationRef = doc(reservationCollectionRef);
  
      const reservationData = {
        hotelId: hotel.id,
        hotelTitle: hotel.title,
        selectedDate: selectedDate.toISOString().split('T')[0],
        numberOfNights,
        fullName,
        phoneNumber,
      };
  
      await setDoc(newReservationRef, reservationData);
  
      console.log('Reservation successfully saved!');
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleFullNameChange = (text) => {
    // Allow only letters and spaces
    const sanitizedText = text.replace(/[^A-Za-z ]/g, '');
    setFullName(sanitizedText);
  };

  const handlePhoneNumberChange = (text) => {
    // Allow only numbers
    const sanitizedText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(sanitizedText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      <Text style={styles.subtitle}>{hotel.title}</Text>

      <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Select Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={onDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Selected Date"
        value={selectedDate.toISOString().split('T')[0]}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Nights"
        keyboardType="numeric"
        value={numberOfNights}
        onChangeText={(text) => setNumberOfNights(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={handleFullNameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />

      <Button title="Confirm Reservation" onPress={handleReservationConfirmation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3498db',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 24,
    color: '#555',
    textAlign: 'center',
  },
  datePickerButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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

export default ReservationScreen;
