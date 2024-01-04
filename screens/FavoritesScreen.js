import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';


const FavoritesScreen = () => {
  const { state: { favorites }, dispatch } = useFavorites();
  const [favoriteHotels, setFavoriteHotels] = useState([]);

  const getCurrentUserId = () => {
    const user = auth.currentUser;

    if (user) {
      return user.uid;
    } else {
      // Handle the case where the user is not logged in
      console.error('User is not logged in');
      return null;
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = getCurrentUserId();
        const userFavoritesRef = collection(db, 'favorites', userId, 'hotels');
        const snapshot = await getDocs(userFavoritesRef);

        const favoriteHotelsData = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          favoriteHotelsData.push({
            id: doc.id,
            ...data,
          });
        });

        setFavoriteHotels(favoriteHotelsData);
      } catch (error) {
        console.error('Error fetching favorite hotels:', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (selectedHotel) => {
    try {
      const userId = getCurrentUserId();
      const favoritesRef = doc(db, 'favorites', userId, 'hotels', selectedHotel.id);

      // Remove the hotel from favorites collection
      await deleteDoc(favoritesRef);

      // Update the local state
      setFavoriteHotels((prevData) =>
        prevData.filter((hotel) => hotel.id !== selectedHotel.id)
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
          color="red" // Both inside and outside are filled with red when it's a favorite
        />

        </TouchableOpacity>
        <Button onPress={() => navigation.navigate('Reservation', { hotel: item })} style={styles.reserveButton}>Reservation</Button>
      </Card.Actions>
    </Card>
  );
    

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteHotels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

export default FavoritesScreen;
