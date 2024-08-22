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

const RegisterScreen = ({navigation}) => {
  const theme = useTheme();

  const [isSecure, setIsSecure] = useState(true);

  const [formValues, handleFormValueChange, setFormValues] = formData({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  return (
    <View style={{flex: 1, padding: 15, backgroundColor: COLORS.WHITE}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
          <Image
           style={{height: 48, width: 40}}
          source={require('../../assets/images/logo.png')}
        />

        <Text style={{...styles.header, marginVertical: 30}}>Register to Continue</Text>
        <CustomTextInput
          labelText={'Name'}
          dense={true}
          value={formValues?.name || ''}
          onChangeText={text => handleFormValueChange('name', text)}
        />
        <CustomTextInput
          labelText={'Email'}
          dense={true}
          style={{marginTop: 20}}
          keyboardType={'email-address'}
          value={formValues?.email || ''}
          onChangeText={text => handleFormValueChange('email', text)}
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
          Register
        </CustomButton>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={{...styles.container, marginTop: 20, padding: 5}}>
          <Text style={{...styles.text}}>Already have an Account? </Text>
          <Text style={{...styles.title}}>Login in</Text>
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
  }
});
