import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../config/constants';

const GetStartedScreen = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#AF373A70']}
      style={{flex: 1, padding: 15}}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{height: 48, width: 48}}
      />
      <Text style={{...styles.heading, marginTop: 20}}>
        Your Cash Flow, Simplified
      </Text>
      <Text style={{...styles.title, marginTop: 5}}>
        Precision in payables and receivables. Start Today!
      </Text>

      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={{height: 45, width: 150}}>
          <LinearGradient colors={['#E93134', '#AF373A']} style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{height: 45, width: 150}}>
          <LinearGradient colors={['#E93134', '#AF373A']} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.TEXT,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.TEXT,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 50,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.WHITE,
  },
});
