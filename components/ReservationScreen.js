import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from "@react-native-community/datetimepicker";

import { database } from '../firebase';

const ReservationScreen = ({ route }) => {
  const { hotel } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [numberOfNights, setNumberOfNights] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const handleReservationConfirmation = async () => {
    try {
      const reservationRef = database.ref('reservations');
      const newReservationRef = reservationRef.push();

      const reservationData = {
        hotelId: hotel.id,
        hotelTitle: hotel.title,
        selectedDate,
        numberOfNights,
        fullName,
        phoneNumber,
      };

      await newReservationRef.set(reservationData);

      console.log('Rezervasyon başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const onDayPress = (day) => {
    // Kullanıcının seçtiği tarih aralığına işaret koymak için
    setMarkedDates({
      [day.dateString]: { selected: true, marked: true, selectedColor: 'blue' },
    });
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

      {/* Takvim (calendar) bileşeni */}
      <Calendar
        current={selectedDate.toISOString().split('T')[0]}
        markedDates={markedDates}
        onDayPress={onDayPress}
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
        onChangeText={(text) => setFullName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
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
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#555',
  },
  datePickerButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});

export default ReservationScreen;
