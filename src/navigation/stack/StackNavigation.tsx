import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../screens/homeScreen/HomeScreen';
import ProfileScreen from '../../screens/profileScreen/ProfileScreen';

const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="HomeScreen"
        options={{gestureEnabled: false}}
        component={HomeScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        options={{gestureEnabled: false}}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
