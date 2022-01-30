import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT } from '../Theme/Style';
import { ListItem, Icon } from 'react-native-elements'
import Icon1 from 'react-native-vector-icons/Ionicons'
import TextInput from '../Compoment/TextInput';
import { CheckBox } from 'react-native-elements'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'

const Home = ({ navigation, route }) => {
    const [isLoding, setloding] = useState(false);
    const [email, setemail] = useState('');
    const [email1, setemail1] = useState('');
    const [name, setName] = useState('');

    const [ischeck, setischeck] = useState(false);

    useEffect(() => {
     AsyncStorage.getItem('name').then((nm)=>{
         if(nm) {
            setName(nm)
         }
     })

    }, []);

    const apiCall = async () => {

        if (validateEmail(email) &&
            validateEmail(email1)) {

            if (email == email1) {
                var access = await AsyncStorage.getItem('access')
                setloding(true);

                const headers = {
                    'Authorization': 'Bearer ' + access,
                    "content-type": "application/json"
                };

                var params = JSON.stringify({
                    email: email,
                    confirm_email: email1,
                    send_fewer_mails: ischeck
                });


                console.log(access);
                console.log(params);
                Axios.post(Urls.baseUrl + 'auth/email-preference/', params, { headers })
                    .then(response => {
                        console.log("======", response)
                        setloding(false);
                        if (validationempty(response.data)) {
                            showToast(response.data.message, "success");
                            navigation.goBack();
                        }
                    }).catch(function (error) {
                        setloding(false);
                        if (error.response) {
                            showToast(JSON.stringify(error.response.data.detail) + "", "error")
                        }
                    });

            }
            else {
                showToast("Email and ReType Email not match", "error")
            }

        }


    }
    return (
        <SafeAreaView style={Style.cointainer}>

            {/* {isLoding ? (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : ( */}
            <View style={{ flex: 1, padding: 10,  flexDirection: 'column' }}>
                <View style={{flexDirection:'row'}}>

               
                <TouchableOpacity style={{
                    marginBottom: 20,
                    justifyContent: 'flex-start', alignItems: 'flex-start',
                }}>
                    <Icon1 name={'arrow-back-outline'} type={'ionicon'} size={30} 
                     onPress={() => { navigation.goBack() }}/>

                 </TouchableOpacity>
                <Text style={{ 
        color:'#000000', 
        flex:1,
        fontSize:18,
        marginBottom:20,
        marginRight:20,
        justifyContent:'center',
        alignSelf:'center',
        textAlign: 'center', //
        }}>{name}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: Colors.divider, padding: 10, flex: 1, flexDirection: 'column' }}>

                        <ListItem containerStyle={{ padding: 4, backgroundColor: 'transparent' }}>
                            <Icon name={'mail'} type={'ionicon'} size={30} color={Colors.lightblack} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 18, fontFamily: CustomeFonts.Poppins_Bold }}> Email Preferences</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>

                        <Text style={[Style.text14, { marginTop: 25, color: Colors.lightblack, }]}>Email Address</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => { setemail(text) }}
                            placeholderTextColor={Colors.gray_d1}
                            value={email}
                            selectionColor={Colors.TheamColor2}
                        />

                        <Text style={[Style.text14, { marginTop: 15, color: Colors.lightblack, }]}>ReType Email</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0, marginBottom: 50, }]}
                            onChangeText={(text) => { setemail1(text) }}
                            placeholderTextColor={Colors.gray_d1}
                            value={email1}
                            selectionColor={Colors.TheamColor2}
                        />

                        <CheckBox
                            textStyle={{ fontSize: 16, fontFamily: CustomeFonts.Poppins_Regular }}
                            containerStyle={{ padding: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                            title='send me fewer emails'
                            checked={ischeck}
                            onPress={() => setischeck(!ischeck)}

                        />

                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <Icon name={'infocirlce'} type={'antdesign'} size={20} style={{ marginRight: 10 }} color={Colors.lightblack} />
                            <View >
                                <Text style={[Style.text14, { lineHeight: 20, color: Colors.gray, }]}>Checking this option means that report and real-time photo/video emails will be withheld.(

                                    <Text style={[{ lineHeight: 20, color: Colors.lightblack, fontFamily: CustomeFonts.Poppins_Bold }]}>Homeowners </Text>

                                    will still receive emails of
                                    <Text style={[{ lineHeight: 20, color: Colors.lightblack, fontFamily: CustomeFonts.Poppins_Bold }]}> construction </Text>

                                    notices.)
                                    <Text textDecorationLine={'italic'} style={[{ textDecorationLine: 'italic', lineHeight: 20, color: Colors.lightblack, fontFamily: CustomeFonts.Poppins_Bold }]}> Recommended if you already receive notifications via the app.</Text>
                                </Text>
                            </View>

                        </View>

                        <View style={[Style.buttonStyle2, { width: '100%', marginTop: 20, }]}>
                            {isLoding ?
                                <View >
                                    <Indicator />
                                </View> :
                                <TouchableOpacity
                                    style={{ width: '100%' }}
                                    onPress={() => {
                                        apiCall()

                                    }}
                                >
                                    <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>SEND</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                </ScrollView>

                <ListItem containerStyle={{ backgroundColor: Colors.divider, padding: 10, }}>
                    <Icon name={'ios-lock-closed'} type={'ionicon'} size={30} color={Colors.lightblack} />
                    <ListItem.Content>
                        <ListItem.Title style={{ fontSize: 18, fontFamily: CustomeFonts.Poppins_Bold }}>Password</ListItem.Title>
                    </ListItem.Content>
                </ListItem>

                <Text
                    onPress={() => {
                        navigation.navigate('ResetPassword', {})
                    }}
                    style={[Style.text14, { borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: Colors.divider, justifyContent: 'center', paddingVertical: 10, paddingLeft: 10, color: Colors.TheamColor2, }]}>Change your password {'>'} </Text>


            </View>
            {/* )
            } */}
        </SafeAreaView >
    );
};

const Data = [
    {
        Time: '123 Green St.',

    },
    {
        Time: '123 Green St.',

    },

];

export default Home;


