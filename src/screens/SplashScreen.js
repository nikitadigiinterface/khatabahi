import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAppLoading, setUserEntryList} from '../redux/reducer/app';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      let userEntryList = await AsyncStorage.getItem('userEntryList');
      let list = JSON?.parse(userEntryList);
      dispatch(setUserEntryList(list));

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
