import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const banners = [
  { id: '1', text: 'Özel Teklif!', color: '#3498db' },
  { id: '2', text: 'İndirimli Fırsatlar!', color: '#e74c3c' },
  { id: '3', text: 'Yeni Oteller Keşfet!', color: '#2ecc71' },
  { id: '4', text: 'Tatilin Keyfini Çıkar!', color: '#f39c12' },
  { id: '5', text: 'Rezervasyon Yap, Puan Kazan!', color: '#9b59b6' },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleBannerPress = (item) => {
    // Banner'a tıklanınca HotelsScreen sayfasına geçiş yapılacak
    console.log('Banner Pressed:', item.text);
    navigation.navigate('Hotels');
  };

  const renderBanner = ({ item }) => (
    <TouchableOpacity onPress={() => handleBannerPress(item)}>
      <View style={[styles.banner, { backgroundColor: item.color }]}>
        <Text style={styles.bannerText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Banner/Slider */}
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderBanner}
        showsVerticalScrollIndicator={false}
      />

      {/* Diğer ana sayfa içeriği buraya gelebilir */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: 350,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
