import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { database } from '../firebase';

const ReservationScreen = ({ route }) => {
  const { hotel } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfNights, setNumberOfNights] = useState('');

  const handleReservationConfirmation = async () => {
    try {
      // Firebase'e rezervasyon bilgilerini kaydet
      const reservationRef = database.ref('reservations');
      const newReservationRef = reservationRef.push();

      const reservationData = {
        hotelId: hotel.id,
        hotelTitle: hotel.title,
        selectedDate,
        numberOfNights,
      };

      await newReservationRef.set(reservationData);

      // Rezervasyon başarılı mesajı veya navigasyon işlemleri burada yapılabilir
      console.log('Rezervasyon başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation for {hotel.title}</Text>
      <Text style={styles.label}>Selected Date: {selectedDate}</Text>

      <TouchableOpacity onPress={() => {/* Tarih seçimi yapmak için bir modal veya başka bir yöntem ekleyebilirsiniz */}}>
        <Text style={styles.datePicker}>Select Date</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Number of Nights"
        keyboardType="numeric"
        value={numberOfNights}
        onChangeText={(text) => setNumberOfNights(text)}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  datePicker: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ReservationScreen;
