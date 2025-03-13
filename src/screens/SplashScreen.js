import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAppLoading, setUserEntryList} from '../redux/reducer/app';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { setAccessToken, setIsLoggedIn, setUserData } from '../redux/reducer/user';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
     

      let is_logged_in = await AsyncStorage.getItem('is_logged_in');
      let userData = await AsyncStorage.getItem('userData');
      let access_token = await AsyncStorage.getItem('access_token');
      let q = JSON?.parse(userData);
      dispatch(setUserData(q));
      dispatch(setIsLoggedIn(is_logged_in));
      dispatch(setAccessToken(access_token));

      setTimeout(() => {
        dispatch(setAppLoading(false));
      }, 1500);
    }
    fetchData();
  }, []);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#AF373A70']}
      style={{...styles.container}}>
      <Image source={require('../assets/images/logo.png')} />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
