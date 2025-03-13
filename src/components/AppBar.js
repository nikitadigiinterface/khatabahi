import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../config/constants';

const AppBar = ({navigation, title}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
      }}>
      <Pressable onPress={() => navigation.goBack()} style={{}}>
        <Image source={require('../assets/images/icons/backArrow.png')} />
      </Pressable>

      <Text
        style={{
          ...styles.title,
        }}>
        {title}
      </Text>
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  title: {
    color: COLORS.TEXT,
    fontSize: 20,
    marginLeft: 15,
    fontFamily: 'Inter-Medium',
  },
});
