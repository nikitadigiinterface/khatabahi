import {
  Image,
  Keyboard,
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
import {registerApi} from '../../api';
import {
  setAccessToken,
  setIsLoggedIn,
  setUserData,
} from '../../redux/reducer/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';

const RegisterScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isSecure, setIsSecure] = useState(true);
  const [isSecure2, setIsSecure2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [valErrors, setValErrors] = useState({});

  const [formValues, handleFormValueChange, setFormValues] = formData({
    email: '',
    password: '',
    name: '',
    password_confirmation: '',
  });

  const user_register = async () => {
    Keyboard.dismiss();
    setValErrors({});
    setIsLoading(true);

    let response = await registerApi({
      ...formValues,
    });

    console.log(response);

    if (response?.status == 1) {
      dispatch(setIsLoggedIn(true));
      dispatch(setAccessToken(response?.data?.token));
      dispatch(setUserData(response?.data?.user));
      await AsyncStorage.setItem('access_token', response?.data?.token);
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(response?.data?.user),
      );
      await AsyncStorage.setItem('is_logged_in', 'true');
      showMessage({
        message: response?.msg,
        type: 'success',
        icon: 'success',
      });
    } else {
      setValErrors(response?.error_array);
      response?.error &&
        showMessage({
          message: response?.error,
          type: 'danger',
          icon: 'danger',
        });
    }
    setIsLoading(false);
  };

  return (
    <View style={{flex: 1, padding: 15, backgroundColor: COLORS.WHITE}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={{height: 48, width: 40}}
          source={require('../../assets/images/logo.png')}
        />

        <Text style={{...styles.header, marginVertical: 30}}>
          Register to Continue
        </Text>
        <CustomTextInput
          labelText={'Name'}
          dense={true}
          value={formValues?.name || ''}
          onChangeText={text => handleFormValueChange('name', text)}
          error={valErrors?.name}
        />
        <CustomTextInput
          labelText={'Email'}
          dense={true}
          style={{marginTop: 20}}
          keyboardType={'email-address'}
          value={formValues?.email || ''}
          onChangeText={text => handleFormValueChange('email', text)}
          error={valErrors?.email}
        />
        <CustomTextInput
          labelText={'Password'}
          dense={true}
          style={{marginTop: 20}}
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
          error={valErrors?.password}
        />

        <CustomTextInput
          labelText={'Confirm Password'}
          dense={true}
          style={{marginTop: 20}}
          value={formValues?.password_confirmation || ''}
          onChangeText={text =>
            handleFormValueChange('password_confirmation', text)
          }
          isSecure={isSecure2}
          right={
            <TextInput.Icon
              icon={isSecure2 ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.PRIMARY}
              onPress={() => setIsSecure2(!isSecure2)}
            />
          }
          error={valErrors?.password_confirmation}
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
          onPress={user_register}
          loading={isLoading}
          disabled={isLoading}
          style={{marginTop: 40}}>
          Register
        </CustomButton>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={{...styles.container, marginTop: 20, padding: 5}}>
          <Text style={{...styles.text}}>Already have an Account? </Text>
          <Text style={{...styles.title}}>Login</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

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
  },
});
