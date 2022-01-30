import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import { Helper } from '../Common/Helper';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword, validatePasswordLogin
} from '../Common/Validations';
import Axios from 'axios'

const Login = ({ navigation, route }) => {

    //admin
    const [loding, setLoding] = useState(false);
    const [loding1, setLoding1] = useState(false);
    const [username, setUserName] = useState('');
    // const [username, setUserName] = useState('backmarche@gmail.com ');
    // const [username, setUserName] = useState('adthedeveloper@gmail.com');
    const [password, setPassword] = useState('');
    const [passwordView, setPasswordView] = useState(true);

    useEffect(() => {

    }, [])

    const validationCheck = () => {
        if (
            validateEmail(username.trim())
            &&
            validatePasswordLogin(password.trim(), 4)
        ) {
            Apicall()
        }
    };



    const Apicall = async () => {

        setLoding(true);
        const params = JSON.stringify({
            "email": username.trim(),
            "password": password.trim(),

        });
        console.log("======", params);
        Axios.post(Urls.baseUrl + Urls.login, params,
            { "headers": { "content-type": "application/json" } })
            .then(async function (response) {
                // console.log("======", response);
                setLoding(false);
                showToast('Login Successfully', "success");
                if (validationempty(response.data.access)) {
                    await AsyncStorage.setItem("access", response.data.access + "");
                    await AsyncStorage.setItem("name", response.data.user.name + "");
                    await AsyncStorage.setItem("email", response.data.user.email + "");
                    await AsyncStorage.setItem("password", password + "");
                    await AsyncStorage.setItem("mobile", response.data.user.mobile + "");
                    await AsyncStorage.setItem("role", response.data.user.role + "");
                    await AsyncStorage.setItem("pk", response.data.user.pk + "");
                    await AsyncStorage.setItem("access_expires_in", response.data.access_expires_in + "");
                    await AsyncStorage.setItem("is_token_register", '0');

                    var role = response.data.user.role;
                    if (role == 'HOMEBUILDER') {
                        LocalData.FLAG = '2'
                        LocalData.FLAGTYPE = 'HOMEBUILDER'
                        navigation.popToTop();
                        navigation.replace('Home');
                    }
                    else {
                        LocalData.FLAG = '1'
                        LocalData.FLAGTYPE = 'HOMEOWNER'
                        navigation.popToTop();
                        navigation.replace('Home');
                    }


                }
            })
            .catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data.detail) + "", "error")
                }
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={[Style.cointainer, { justifyContent: 'center', padding: '3%' }]}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                    <View >
                        <Text style={[Style.text22, { lineHeight: 25, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 30, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Log in</Text>

                        <Text style={[Style.text14, { marginTop: 10, color: Colors.lightblack, }]}>Email or UserName</Text>

                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setUserName(text)}
                            // title={'Email or UserName'}
                            placeholderTextColor={Colors.gray_d1}
                            value={username}
                            iconName={'help-circle'}
                            // iconPress={() => { console.log('passwprd 1 check '); setPasswordView(!passwordView) }}
                            iconType='ionicon'
                            selectionColor={Colors.TheamColor2}
                        />
                        <Text style={[Style.text14, { marginTop: 10, color: Colors.lightblack, }]}>Password</Text>

                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setPassword(text)}
                            // title={'Password'}
                            placeholderTextColor={Colors.gray_d1}
                            value={password}
                            secureTextEntry={true}
                            selectionColor={Colors.TheamColor2}
                            secureTextEntry={passwordView}
                            selectionColor={Colors.TheamColor2}
                            iconName={passwordView ? 'eye-off' : 'eye'}
                            iconPress={() => { console.log('passwprd 1 check '); setPasswordView(!passwordView) }}
                            iconType='ionicons' />


                        <Text style={[Style.text16, { marginTop: 15, textAlign: 'left', width: '100%', color: Colors.TheamColor2 }]}>Forgot password?</Text>


                        <View style={[{ width: '100%', flexDirection: 'row' }]}>

                            <View style={[Style.buttonStyle2, { marginTop: 30, flex: 1 }]}>
                                {loding ?
                                    <View >
                                        <Indicator />
                                    </View> :
                                    <TouchableOpacity
                                        style={{ width: '100%' }}
                                        onPress={() => {
                                            validationCheck()
                                        }}
                                    >
                                        <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>Login</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>

                        <Text style={[Style.text16, { justifyContent: 'center', textAlign: 'center', marginTop: 50 }]}>I can't log into my account.
                            <TouchableOpacity onPress={() => {
                                navigation.replace('ResetPassword', {})
                            }}>
                                <Text style={[Style.text16, { color: Colors.TheamColor2 }]}> Reset Your Password</Text>
                            </TouchableOpacity></Text>

                        <Text style={[Style.text16, { justifyContent: 'center', textAlign: 'center', marginTop: 25 }]}>How do i log in?
                            <Text onPress={() => {
                                navigation.replace('Register')
                            }}
                                style={[Style.text16, { color: Colors.TheamColor2 }]}> Set Up your login</Text>
                        </Text>


                    </View>
                </ScrollView>
            </View>
            {/* </ImageBackground> */}
        </SafeAreaView >
    );

}

export default Login;