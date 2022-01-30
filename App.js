/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import Route from './App/Navigation/Route';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
import { MenuProvider } from 'react-native-popup-menu';
import CustomeFonts from './App/Theme/CustomeFonts'
import Ionicons from 'react-native-vector-icons/Ionicons';


const toastConfig = {

  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      text1NumberOfLines={4}
      text1Style={{
        fontSize: 12,
        fontFamily: CustomeFonts.Poppins_Regular
      }}
      renderTrailingIcon={() => <Ionicons name={'close'} color={'#3d3d3d'}
        style={{ justifyContent: 'center', alignSelf: 'center', marginRight: 6 }}
        size={20} onPress={() => { Toast.hide() }} />}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      text1NumberOfLines={4}
      // renderTrailingIcon={() => <Ionicons name="home-outline"  size={20} />}
      text1Style={{
        fontSize: 12,
        fontFamily: CustomeFonts.Poppins_Regular
      }}
      renderTrailingIcon={() => <Ionicons name={'close'} color={'#3d3d3d'}
        style={{ justifyContent: 'center', alignSelf: 'center', marginRight: 6 }}
        size={20} onPress={() => { Toast.hide() }} />}
    />
  ),

};
const App = () => {
  
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Route />
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </MenuProvider>
    </SafeAreaProvider>

  );
};

export default App;
