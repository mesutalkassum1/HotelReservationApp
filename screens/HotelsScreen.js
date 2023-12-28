import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../firebase';
import { get, ref } from 'firebase/database';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';

const HotelScreen = ({ navigation }) => {
  const { state: { favorites }, dispatch } = useFavorites();
  const [hotelData, setHotelData] = useState([]);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(0);

  const handleFavoriteToggle = (selectedHotel) => {
    if (selectedHotel.isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: selectedHotel });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: selectedHotel });
    }

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
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.thumbnail }} style={styles.cardImage} />
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardSubtitle}>{item.subtitles.join(', ')}</Paragraph>
        <Paragraph style={styles.cardPrice}>{`${item.price.currency}${item.price.value} ${item.price.period}`}</Paragraph>
        <Paragraph style={styles.cardRating}>{`Rating: ${item.rating}`}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <TouchableOpacity onPress={() => handleFavoriteToggle(item)}>
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={30}
            color={item.isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <Button onPress={() => navigation.navigate('Reservation', { hotel: item })} style={styles.reserveButton}>Reservation</Button>
      </Card.Actions>
    </Card>
  );

  // Dynamically update the header options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('FavoritesScreen')}>
          <Ionicons name="heart" size={30} color="red" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={hotelData}
        renderItem={renderItem}
        keyExtractor={(item) => item.link}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardImage: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'gray',
    marginBottom: 5,
  },
  cardPrice: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardRating: {
    color: 'green',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  reserveButton: {
    backgroundColor: 'orange',
  },
});

export default HotelScreen;
