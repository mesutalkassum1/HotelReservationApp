import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebase';
import { get, ref } from 'firebase/database';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'

const HotelScreen = ({ navigation }) => {
  const [hotelData, setHotelData] = useState([]);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(0);

  const handleFavoriteToggle = (selectedHotel) => {
    setHotelData((prevData) =>
      prevData.map((hotel) =>
        hotel.id === selectedHotel.id ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reference = ref(database, 'airbnbHotels/');
        const snapshot = await get(reference);
        const data = snapshot.val();

        if (data) {
          const totalHotels = Object.keys(data).length;
          setTotalPages(Math.ceil(totalHotels / itemsPerPage));

          const startIndex = 0;
          const endIndex = itemsPerPage;

          const airbnbHotels = Object.keys(data || {})
            .slice(startIndex, endIndex)
            .map((key) => ({
              id: key,
              isFavorite: false,
              ...data[key],
            }));

          setHotelData(airbnbHotels);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <Card>
      <Card.Cover source={{ uri: item.thumbnail }} />
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.subtitles.join(', ')}</Paragraph>
        <Paragraph>{`${item.price.currency}${item.price.value} ${item.price.period}`}</Paragraph>
        <Paragraph>{`Rating: ${item.rating}`}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity onPress={() => handleFavoriteToggle(item)}>
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={30}
            color={item.isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <Button onPress={() => navigation.navigate('Reservation', { hotel: item })}>Reservation</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View>
      <FlatList
        data={hotelData}
        renderItem={renderItem}
        keyExtractor={(item) => item.link}
      />
    </View>
  );
};

export default HotelScreen;