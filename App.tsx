import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from 'react-native-paper';
import Navigation from './src/navigation';
import {Provider as ReduxProvider} from 'react-redux';
import store from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {COLORS} from './src/config/constants';

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#AF373A',
      background: '#FFFFFF',
    },
    fonts: configureFonts({config: {fontFamily: 'Inter-Regular'}}),
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={COLORS.WHITE}
      />
      <PaperProvider theme={theme}>
        <ReduxProvider store={store}>
          <NavigationContainer>
            <Navigation />
            <FlashMessage floating />
          </NavigationContainer>
        </ReduxProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
