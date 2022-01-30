import RNFirebase from 'react-native-firebase';
// import * as firebase from 'firebase/app';

const firebaseConfigq = {
  apiKey: "AIzaSyBcgeuvDf73NHqB8TQksk07etkiBViovcA",
  authDomain: "homeapp-deea0.firebaseapp.com",
  projectId: "homeapp-deea0",
  databaseURL: "https://homeapp-deea0-default-rtdb.firebaseio.com/",
  storageBucket: "homeapp-deea0.appspot.com",
  messagingSenderId: "363001950100",
  appId: "1:363001950100:web:efe3feafc63e95449fe981",
  measurementId: "G-WJZHG8NFLV"
};
RNFirebase.initializeApp(firebaseConfigq)

export default RNFirebase



// firebase.initializeApp(firebaseConfig);
