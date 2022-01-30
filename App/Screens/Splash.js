import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import { ScrollView } from 'react-native-gesture-handler';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validationempty } from '../Common/Validations';
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import PushController from '../../PushController';

var role = ''
const App = ({ navigation }) => {
    //admin
    const [loding, setLoding] = useState(false);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const logout = async () => {
        await AsyncStorage.setItem('access', '')
        await AsyncStorage.setItem('name', '')
        await AsyncStorage.setItem('email', '')
        await AsyncStorage.setItem('mobile', '')
        await AsyncStorage.setItem('role', '')
        await AsyncStorage.setItem('pk', '')
    }

    const userProfile = async () => {
        var role = await AsyncStorage.getItem('role')
        var access = await AsyncStorage.getItem('access')
        var password = await AsyncStorage.getItem('password')
        var email = await AsyncStorage.getItem('email')

        let decodedToken = jwt_decode(access);
        let currentDate = new Date();

        // JWT exp is in seconds
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            console.log("Token expired.");
            logout()
            // if (validationempty(role)) {
            //     console.log("======qqq");
            //     const params = JSON.stringify({
            //         "email": email,
            //         "password": password,

            //     });
            //     Axios.post(Urls.baseUrl + Urls.login, params,
            //         { "headers": { "content-type": "application/json" } })
            //         .then(async function (response) {
            //             console.log("======", response);
            //             setLoding(false);
            //             showToast('Login Successfully', "success");
            //             if (validationempty(response.data.access)) {
            //                 await AsyncStorage.setItem("access", response.data.access + "");

            //                 var role = response.data.user.role;
            //                 if (role == 'HOMEBUILDER') {
            //                     LocalData.FLAG = '2'
            //                     LocalData.FLAGTYPE = 'HOMEBUILDER'
            //                     navigation.popToTop();
            //                     navigation.replace('Home');
            //                 }
            //                 else {
            //                     LocalData.FLAG = '1'
            //                     LocalData.FLAGTYPE = 'HOMEOWNER'
            //                     navigation.popToTop();
            //                     navigation.replace('Home');
            //                 }


            //             }
            //         })
            //         .catch(function (error) { });
            // }
        } else {
            console.log("Valid token");
            if (validationempty(role)) {
                if (role == 'HOMEBUILDER') {
                    LocalData.FLAG = '2'
                    LocalData.FLAGTYPE = 'HOMEBUILDER'
                }
                else {
                    LocalData.FLAG = '1'
                    LocalData.FLAGTYPE = 'HOMEOWNER'
                }
                navigation.popToTop();
                navigation.replace('Home');
            }
        }


    }

   
    useEffect(() => {
        userProfile()
    }, [])


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={[Style.cointainer, { justifyContent: 'center', padding: '3%' }]}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                    <View >

                        <Text style={[Style.text22, { color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Which best describes you?</Text>


                        <TouchableOpacity
                            onPress={() => {
                                LocalData.FLAG = '1'
                                LocalData.FLAGTYPE = 'HOMEOWNER'
                                navigation.navigate('Register')
                            }}
                            style={[Style.card, { marginTop: 30 }]}>
                            <Text style={[Style.text16, { height: 60, color: Colors.white, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center', padding: 6 }]}>Home Owner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                LocalData.FLAG = '2'
                                LocalData.FLAGTYPE = 'HOMEBUILDER'
                                navigation.navigate('Register')
                            }}

                            style={[Style.card, { marginTop: 20 }]}>
                            <Text style={[Style.text16, { height: 60, color: Colors.white, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center', padding: 6 }]}>Home Builder</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
            {validationempty(role) ?
                <PushController /> : null}

        </SafeAreaView >
    );

}

export default App;
