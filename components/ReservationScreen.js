
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReservationScreen from '../components/ReservationScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const ReservationStack = () => {
  return (
    <NavigationContainer>
      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{ headerShown: false }}
      />
    </NavigationContainer>
  );
};

export default ReservationStack;