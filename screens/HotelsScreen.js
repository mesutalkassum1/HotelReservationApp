// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList } from 'react-native';
// import { database } from '../firebase'; // Firebase SDK'dan gelen database nesnesini içeri aktarın
// import { onValue, ref } from 'firebase/database';
// // import { ref, onValue} from 'firebase/database'

// const HotelScreen = () => {
//   const [hotelData, setHotelData] = useState([]);

//   useEffect(() => {
//     console.log(database);
//       const referance = ref(database, 'airbnbHotels/');
//       onValue(referance, (snapshot) => {
//         const data = snapshot.val();
//         const airbnbHotels = Object.keys(data).map(key => ({
//           id:key,
//           ...data[key]
//         }));
//         console.log(airbnbHotels);
//         setHotelData(airbnbHotels);
//       })
//   })

//   // Verileri içeren FlatList'i oluşturun
//   const renderItem = ({ item }) => (
//     <View>
//       <Image source={{ uri: item.thumbnail }} style={{ width: 100, height: 100 }} />
//       <Text>{item.title}</Text>
//       <Text>{item.subtitles.join(', ')}</Text>
//       <Text>{`${item.price.currency}${item.price.value} ${item.price.period}`}</Text>
//       <Text>{`Rating: ${item.rating}`}</Text>
//       <Text>{item.link}</Text>
//     </View>
//   );

//   return (
//     <View>
//       <FlatList
//         data={hotelData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.link}
//       />
//     </View>
//   );
// };

// export default HotelScreen;

//===================================================================
//===================================================================
//===================================================================
//===================================================================


// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, Button } from 'react-native';
// import { database } from '../firebase';
// import { get, ref } from 'firebase/database';

// const HotelScreen = () => {
//   const [hotelData, setHotelData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const reference = ref(database, 'airbnbHotels/');
//         const snapshot = await get(reference);
//         const data = snapshot.val();

//         if (data) {
//           const totalHotels = Object.keys(data).length;
//           setTotalPages(Math.ceil(totalHotels / 10));

//           const startIndex = (page - 1) * 10;
//           const endIndex = startIndex + 10;

//           const airbnbHotels = Object.keys(data || {})
//             .slice(startIndex, endIndex)
//             .map((key) => ({
//               id: key,
//               ...data[key],
//             }));

//           setHotelData(airbnbHotels);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [page]);

//   const renderItem = ({ item }) => (
//     <View>
//       <Image source={{ uri: item.thumbnail }} style={{ width: 100, height: 100 }} />
//       <Text>{item.title}</Text>
//       <Text>{item.subtitles.join(', ')}</Text>
//       <Text>{`${item.price.currency}${item.price.value} ${item.price.period}`}</Text>
//       <Text>{`Rating: ${item.rating}`}</Text>
//       <Text>{item.link}</Text>
//     </View>
//   );

//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };

//   const handleLoadLess = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         data={hotelData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.link}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.1}
//       />
//       <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
//         <Button title="Previous Page" onPress={handleLoadLess} disabled={page === 1} />
//         <Text>{`Page ${page} of ${totalPages}`}</Text>
//         <Button title="Next Page" onPress={handleLoadMore} disabled={page === totalPages} />
//       </View>
//     </View>
//   );
// };

// export default HotelScreen;









import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebase';
import { get, ref } from 'firebase/database';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import ReservationScreen from '../components/ReservationScreen';

const HotelScreen = ({ navigation }) => {
  const [hotelData, setHotelData] = useState([]);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(0);

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
        {/* <Button onPress={() => navigation.navigate('Detail', { hotel: item })}>Detay</Button> */}
        <Button  onPress={() => navigation.navigate('Reservation', { hotel: item })}>Reservation</Button>
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



// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native';
// import { database } from '../firebase';
// import { get, ref } from 'firebase/database';

// const HotelScreen = () => {
//   const [hotelData, setHotelData] = useState([]);
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 15; // Sayfa başına gösterilecek otel sayısı
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const reference = ref(database, 'airbnbHotels/');
//         const snapshot = await get(reference);
//         const data = snapshot.val();

//         if (data) {
//           const totalHotels = Object.keys(data).length;
//           setTotalPages(Math.ceil(totalHotels / itemsPerPage));

//           const startIndex = (page - 1) * itemsPerPage;
//           const endIndex = startIndex + itemsPerPage;

//           const airbnbHotels = Object.keys(data || {})
//             .slice(startIndex, endIndex)
//             .map((key) => ({
//               id: key,
//               ...data[key],
//             }));

//           setHotelData(airbnbHotels);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [page]);

//   const renderItem = ({ item }) => (
//     <View>
//       <Image source={{ uri: item.thumbnail }} style={{ width: 100, height: 100 }} />
//       <Text>{item.title}</Text>
//       <Text>{item.subtitles.join(', ')}</Text>
//       <Text>{`${item.price.currency}${item.price.value} ${item.price.period}`}</Text>
//       <Text>{`Rating: ${item.rating}`}</Text>
//       <Text>{item.link}</Text>
//     </View>
//   );

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   return (
//     <View>
//       <FlatList
//         data={hotelData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.link}
//       />
//       <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
//         {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
//           <TouchableOpacity
//             key={pageNumber}
//             onPress={() => handlePageChange(pageNumber)}
//             style={{
//               paddingHorizontal: 10,
//               paddingVertical: 5,
//               backgroundColor: page === pageNumber ? 'gray' : 'lightgray',
//               marginHorizontal: 5,
//               borderRadius: 5,
//             }}
//           >
//             <Text>{pageNumber}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default HotelScreen;
