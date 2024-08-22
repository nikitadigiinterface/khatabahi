import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import {TextInput, useTheme} from 'react-native-paper';
import {COLORS} from '../../config/constants';
import {formData} from '../../config/formData';

const LoginScreen = ({navigation}) => {
  const theme = useTheme();

  const [isSecure, setIsSecure] = useState(true);

  const [formValues, handleFormValueChange, setFormValues] = formData({
    email: '',
    password: '',
  });

  return (
    <View style={{flex: 1, padding: 15, backgroundColor: COLORS.WHITE}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={{height: 48, width: 40}}
          source={require('../../assets/images/logo.png')}
        />

        <Text style={{...styles.header, marginVertical: 30}}>Log in to Continue</Text>
        <CustomTextInput
          dense={true}
        labelText={'Email'}
          keyboardType={'email-address'}
          value={formValues?.email || ''}
          onChangeText={text => handleFormValueChange('email', text)}
        />
        <CustomTextInput
        style={{marginTop: 20}}
          dense={true}
          labelText={'Password'}
          value={formValues?.password || ''}
          onChangeText={text => handleFormValueChange('password', text)}
          isSecure={isSecure}
          right={
            <TextInput.Icon
              icon={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.PRIMARY}
              onPress={() => setIsSecure(!isSecure)}
            />
          }
        />
        <Pressable style={{marginTop: 10, padding: 5}} onPress={() => {}}>
          <Text
            style={{
              ...styles.title,
              textAlign: 'right',
            }}>
            Forgot Password?
          </Text>
        </Pressable>

        <CustomButton
          onPress={() => navigation.navigate('Drawer')}
          style={{marginTop: 40}}>
          Log in
        </CustomButton>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{...styles.container, marginTop: 20, padding: 5}}>
          <Text style={{...styles.text}}>Don't have an Account? </Text>
          <Text style={{...styles.title}}>Sign Up</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.PRIMARY,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  text: {
    color: COLORS.DARKGREY,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  header: {
    color: COLORS.TEXT,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  }
});
