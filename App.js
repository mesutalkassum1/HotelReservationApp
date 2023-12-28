import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';

import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import ResetPasswordScreen from './screens/ResetPassword';
import HotelsScreen from './screens/HotelsScreen';
import ReservationScreen from './components/ReservationScreen';
import EditReservation from './components/EditReservation'
import { FavoritesProvider } from './components/FavoritesContext';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const MyReservations = () => {
    return (
      <Stack.Navigator>

        <Stack.Screen
          name="MyReservation"
          options={{
            headerShown:false,
            title: "My Reservation",
            presentation: "transparentModal",
          }}
          component={ReservationsScreen}
        />
        <Stack.Screen
          name="EditReservation"
          options={{
            title: "Edit Reservation"
          }}
          component={EditReservation}
          />
        </Stack.Navigator>  
    );
  };

  const HotelStack = () => {
    return (
      <FavoritesProvider>  
        <Stack.Navigator>
          <Stack.Screen
            name="Hotelss"
            options={{
              // headerShown:false,
              title: "Hotels",
              presentation: "transparentModal",
            }}
            component={HotelsScreen}
          />
        <Stack.Screen
          name="FavoritesScreen"
            options={{
              title: "Favorites",
            }}
            component={FavoritesScreen}
        />
          <Stack.Screen
            name="Reservation"
            options={{
              title: "Make a reservation",
              // presentation: "transparentModal",
            }}
            component={ReservationScreen}
          />
        </Stack.Navigator>
      </FavoritesProvider>
    );
  };

  return (
    <NavigationContainer>
      {!userLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {(props) => <LoginScreen {...props}  setUserLoggedIn={setUserLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: 'Sign Up' }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ title: 'Reset Password' }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown:false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Hotels"
            component={HotelStack}
            options={{
              headerShown:false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="hotel" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Reservations"
            component={MyReservations}
            options={{
              headerShown:false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="calendar-alt" color={color} size={size} />
              ),
            }}
          />

            <Tab.Screen
              name="Admin"
              component={AdminScreen}
              options={{
                headerShown:false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="admin-panel-settings" color={color} size={size} />
                ),
              }}
            />
         <Tab.Screen
            name="Profile"
            options={{
              headerShown:false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}          >
            {(props) => <ProfileScreen {...props} setUserLoggedIn={setUserLoggedIn} />}
          </Tab.Screen>
         
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;