import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import {useSelector} from 'react-redux';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DrawerNavigation from './DrawerNavigation';
import ListScreen from '../screens/ListScreen';
import MyTagsScreen from '../screens/Tags/MyTagsScreen';
import TagsChatScreen from '../screens/Tags/TagsChatScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const {appLoading} = useSelector(state => state.app);
  const {isLoggedIn} = useSelector(state => state.user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {appLoading && <Stack.Screen name="Splash" component={SplashScreen} />}

      {!isLoggedIn ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Drawer" component={DrawerNavigation} />
          <Stack.Screen name="AddEntry" component={AddEntryScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="MyTags" component={MyTagsScreen} />
          <Stack.Screen name="TagsChat" component={TagsChatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
