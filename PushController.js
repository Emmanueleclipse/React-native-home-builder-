import React, { useEffect, useState } from 'react';
import PushNotification from "react-native-push-notification";
import Axios from 'axios'
import { LocalData, Params, Urls } from './App/Common/Urls';
import {
  validatePhone, validateEmail, validateName, matchPassword,
  validationempty, validationBlank, validatePassword
} from './App/Common/Validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";


const App = ({ navigation }) => {
  useEffect(() => {
   
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token.token);

      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification here

        // required on iOS only 
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: "363001950100",
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      // This line solves the problem that I was facing.
      requestPermissions: Platform.OS === 'ios',
    });
  }, [])

  return (
    null
  );
}
export default App;