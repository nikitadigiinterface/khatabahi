import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerScreen from './CustomDrawerScreen';
import HomeScreen from '../screens/HomeScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({navigation}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: '70%'},
        drawerPosition: 'right'
      }}
      drawerContent={props => <CustomDrawerScreen {...props} />}
      >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          onBlur: () => console.log('BLURRED'),
          // unmountOnBlur: true
        }}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation

const styles = StyleSheet.create({})