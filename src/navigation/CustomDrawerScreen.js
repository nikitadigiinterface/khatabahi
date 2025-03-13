import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {COLORS} from '../config/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../components/CustomButton';
import {CommonActions} from '@react-navigation/native';
import store from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setAccessToken,
  setIsLoggedIn,
  setUserData,
} from '../redux/reducer/user';

const CustomDrawerScreen = ({navigation}) => {
  const LogOut = async () => {
    // const navigation = useNavigation();
    Alert.alert('Confirm', 'Are you sure to want to logout?', [
      {
        text: 'No',
        onPress: () => {
          return false;
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user_data');
          await AsyncStorage.removeItem('is_logged_in');
          store.dispatch(setAccessToken(null));
          store.dispatch(setUserData(null));
          store.dispatch(setIsLoggedIn(false));

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          // navigation.navigate('Login');
          console.log('Logged out');
        },
      },
    ]);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 100}}
      style={{padding: 10}}>
      <Pressable onPress={() => navigation.closeDrawer()} style={{padding: 10}}>
        <FontAwesome5 name={'window-close'} size={25} color={COLORS.PRIMARY} />
      </Pressable>

      <View style={{...styles.rowcenter, marginTop: 20}}>
        <FontAwesome5 name={'user-alt'} size={24} color={COLORS.PRIMARY} />
        <Text style={{...styles.header, marginLeft: 10}}>Account</Text>
      </View>

      <View style={{...styles.card, marginTop: 25}}>
        <Pressable  style={{...styles.container}}>
          <FontAwesome5 name={'cog'} size={20} color={COLORS.PRIMARY} />
          <Text style={{...styles.title, marginLeft: 10}}>Settings</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('MyTags');
            navigation.closeDrawer();
          }}
          style={{...styles.container}}>
          <FontAwesome5
            name={'comment-dots'}
            size={20}
            color={COLORS.PRIMARY}
          />
          <Text style={{...styles.title, marginLeft: 10}}>My Tags</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('List');
            navigation.closeDrawer();
          }}
          style={{...styles.container}}>
          <FontAwesome5 name={'list-alt'} size={20} color={COLORS.PRIMARY} />
          <Text style={{...styles.title, marginLeft: 10}}>Contacts</Text>
        </Pressable>
        <Pressable style={{...styles.container}}>
          <FontAwesome5 name={'info-circle'} size={20} color={COLORS.PRIMARY} />
          <Text style={{...styles.title, marginLeft: 10}}>Info</Text>
        </Pressable>
        <Pressable
          style={{...styles.container, marginBottom: 0, borderBottomWidth: 0}}>
          <FontAwesome5 name={'headset'} size={20} color={COLORS.PRIMARY} />
          <Text style={{...styles.title, marginLeft: 10}}>Support</Text>
        </Pressable>
      </View>

      <CustomButton
        onPress={LogOut}
        icon={'logout'}
        style={{marginTop: 50, marginHorizontal: 15}}>
        Log Out
      </CustomButton>
    </ScrollView>
  );
};

export default CustomDrawerScreen;

const styles = StyleSheet.create({
  rowcenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 10,
    margin: 15,
    marginVertical: 10,
    // borderWidth: 0.8,
    borderColor: '#CACACA',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: COLORS.LIGHTGREY,
    paddingVertical: 10,
    marginBottom: 5,
  },
});
