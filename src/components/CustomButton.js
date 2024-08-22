import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ActivityIndicator, Button, useTheme} from 'react-native-paper';

const CustomButton = ({
  mode = 'contained',
  style,
  onPress,
  loading,
  disabled,
  children,
  contStyle,
  textStyle,
  containerStyle,
  icon,
  roundness = 1,
}) => {
  const theme = useTheme();

  return (
    <View style={style}>
      <Button
        icon={icon}
        onPress={onPress}
        theme={{roundness: roundness}}
        mode={mode}
        labelStyle={{
          ...styles.labelStyle,
          color:
            mode == 'contained'
              ? theme.colors.background
              : theme.colors.primary,
          ...textStyle,
        }}
        style={{
          backgroundColor: mode == 'contained' ? theme.colors.primary : null,
          borderWidth: mode == 'outlined' ? 1 : null,
          borderColor: theme.colors.primary,
          ...contStyle,
        }}
        contentStyle={{
          paddingVertical: 2,
          // paddingHorizontal: 10,
          ...containerStyle,
        }}
        disabled={disabled}
        loading={loading}>
        {children}
      </Button>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});
