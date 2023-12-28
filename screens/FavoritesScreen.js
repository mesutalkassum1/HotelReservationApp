import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFavorites } from '../components/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
  const { state: { favorites }, dispatch } = useFavorites();

  const handleUnfavorite = (hotelId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { id: hotelId } });
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
            color={item.isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <Button onPress={() => navigation.navigate('Reservation', { hotel: item })} style={styles.reserveButton}>Reservation</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Your Favorite Hotels:</Text> */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No favorite hotels found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
