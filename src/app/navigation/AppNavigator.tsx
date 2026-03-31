import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../features/cart/screens/HomeScreen';
import { ProductScreen } from '../../features/cart/screens/ProductScreen';
import { CartScreen } from '../../features/cart/screens/CartScreen';
import { AddressScreen } from '../../features/cart/screens/AddressScreen';
import { LoginScreen } from '../../features/cart/screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Product: { productId: string };
  Cart: undefined;
  Address: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Cart" component={CartScreen}  options={{ title: "Review Cart" }}/>
        <Stack.Screen name="Address" component={AddressScreen} options={{ title: "Select Conditions" }}/>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};