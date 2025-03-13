import {StyleSheet, View} from 'react-native';
import React from 'react';
import {HelperText, TextInput, Text, useTheme} from 'react-native-paper';
import { COLORS } from '../config/constants';

const CustomTextInput = ({
  autoRef,
  onChangeText,
  placeholder,
  value,
  defaultValue,
  keyboardType,
  dense = false,
  maxLength,
  contStyle,
  right,
  left,
  onEndEditing,
  mode = 'outlined',
  isSecure = false,
  autoComplete = 'off',
  editable = true,
  pointerEvents = 'auto',
  autoCapitalize = 'sentences',
  style,
  multiline,
  onContentSizeChange,
  placeholderTextColor = '#AAAAAA',
  underlineColor,
  underlineStyle,
  labelText,
  roundness = 8,
  title,
  error,
  contentStyle,
  titleStyle,
  onFocus,
  onBlur,
  autoFocus,
  outlineColor,
  activeOutlineColor,
  onSubmitEditing,
  onSelectionChange
}) => {
  const theme = useTheme();
  return (
    <View style={style}>
      {title ? (
        <Text style={{...styles.title, ...titleStyle}}>{title}</Text>
      ) : null}
      <TextInput
        theme={{roundness: roundness}}
        outlineColor={outlineColor || COLORS.LIGHTGREY}
        activeOutlineColor={activeOutlineColor}
        label={labelText}
        autoFocus={autoFocus}
        underlineColor={underlineColor}
        maxLength={maxLength}
        underlineStyle={underlineStyle}
        dense={dense}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        multiline={multiline}
        mode={mode}
        style={{
          ...styles.input,
          backgroundColor: theme.colors.background,
          ...contStyle,
        }}
        contentStyle={{...contentStyle}}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={false}
        left={left}
        right={right}
        textColor={theme.colors.tertiary}
        value={value}
        defaultValue={defaultValue}
        keyboardType={keyboardType ? keyboardType : 'default'}
        secureTextEntry={isSecure}
        editable={editable}
        pointerEvents={pointerEvents}
        onContentSizeChange={onContentSizeChange}
        placeholderTextColor={placeholderTextColor}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        cursorColor={COLORS.DARKGREY}
        selectionColor={COLORS.DARKGREY}
        onSelectionChange={onSelectionChange}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
  title: {
    marginTop: 20,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginBottom: 5
  },
});
