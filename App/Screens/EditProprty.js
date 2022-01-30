import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, Picker, Button, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Icon1 from 'react-native-vector-icons/Ionicons'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { Helper } from '../Common/Helper';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'

var property_id;
const App = ({ navigation, route }) => {
    const { pk, data } = route.params;


    //admin
    const [loding, setLoding] = useState(false);
    const [name, setname] = useState(data.name);
    const [address, setaddress] = useState(data.address);
    const [city, setcity] = useState(data.city);
    const [statedata, setstatedata] = useState(data.state);
    const [zipcode, setzipcode] = useState(data.zip_code);
    const [iisLoding, isetLoding] = useState(false);
    const [email, setEmail] = useState("");
    const [infoclick, setinfoclick] = useState(false);

    useEffect(() => {

    }, [])

    const validationCheck = () => {
        if (
            validationBlank(name, "Enter Property Name") &&
            validationBlank(address, "Enter Address") &&
            validationBlank(city, "Enter City") &&
            validationBlank(statedata, "Enter State") &&
            validationBlank(zipcode, "Enter Zipcode")

        ) {
            apiCall()
        }
    };

    const apiCall = async () => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);
        var params = JSON.stringify({
            name: name,
            address: address,
            city: city,
            state: statedata,
            zip_code: zipcode,
        });

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        Axios.put(Urls.baseUrl + 'api/property/' + pk, params, { headers })
            .then(response => {
                // console.log("======", response)
                setLoding(false);
                if (validationempty(response.data)) {
                    console.log("======pk", response.data.pk)
                    showToast('Updated Successfully', "success");
                    navigation.popToTop();
                }
            }).catch(function (error) {
                setLoding(false);
                console.log("======", error.response)
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }

            });

    };

    const apiCall_Invite = async () => {

        if (validationBlank(email, "Enter Email")
        ) {

            var access = await AsyncStorage.getItem('access')
            isetLoding(true);

            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": "application/json"
            };

            var params = JSON.stringify({
                property: property_id,
                receiver: email,
            });

            console.log(access);
            console.log(params);
            Axios.post(Urls.baseUrl + 'api/invite-send/', params, { headers })
                .then(response => {
                    console.log("======", response)
                    isetLoding(false);
                    if (validationempty(response.data)) {
                        showToast('Invitation sent successfully !', "success");
                        navigation.popToTop();
                        setinfoclick(false);

                    }
                }).catch(function (error) {
                    isetLoding(false);
                    console.log(error.response);
                    if (error.response) {
                        showToast(JSON.stringify(error.response.data) + "", "error")
                    }

                });
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, }}>

            <View style={[Style.cointainer, {}]}>

                <TouchableOpacity style={{
                    marginHorizontal: 20,
                    marginVertical: 15,
                    justifyContent: 'flex-start', alignItems: 'flex-start'
                }}>
                    <Icon1 name={'arrow-back-outline'} type={'ionicon'} size={30}
                        onPress={() => { navigation.goBack() }} />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 20 }}>
                        {/* <Text style={[Style.text22, { fontFamily: CustomeFonts.Poppins_Bold, marginVertical: 20, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>New Message</Text> */}


                        <Text style={[Style.text22, { lineHeight: 25, marginBottom: 30, fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack }]}>Edit Property</Text>


                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>Property Name</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setname(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={name}
                            title='Enter Text'
                            selectionColor={Colors.TheamColor2}
                        />
                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 25, color: Colors.lightblack, }]}>Property Address</Text>

                        <TextInput style={[Style.textInput, { marginTop: 10 }]}
                            onChangeText={(text) => setaddress(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={address}
                            title='Address'
                            selectionColor={Colors.TheamColor2}
                        />

                        <TextInput style={[Style.textInput, { marginTop: 10 }]}
                            onChangeText={(text) => setcity(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={city}
                            title='City'
                            selectionColor={Colors.TheamColor2}
                        />

                        <TextInput style={[Style.textInput, { marginTop: 10 }]}
                            onChangeText={(text) => setstatedata(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={statedata}
                            title='State'
                            selectionColor={Colors.TheamColor2}
                        />

                        <TextInput style={[Style.textInput, { marginTop: 10 }]}
                            onChangeText={(text) => setzipcode(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={zipcode}
                            title='Zip Code'
                            selectionColor={Colors.TheamColor2}
                        />



                    </View>


                    <Modal
                        useNativeDriver={false}
                        animationType="slide"
                        transparent={true}
                        visible={infoclick}
                        onRequestClose={() => {
                            setinfoclick(!infoclick);
                        }}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView1}>
                                <ScrollView contentContainerStyle={styles.modalView}>

                                    <View style={[Style.cointainer, { justifyContent: 'center', padding: '3%' }]}>
                                        <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                            <Icon onPress={() => { setinfoclick(false) }}
                                                name={'close'} type={'ionicon'} size={25} color={Colors.gray} />
                                        </View>
                                        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                            <View >

                                                <Text style={[Style.text22, { marginTop: 20, lineHeight: 25, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 8, color: Colors.lightblack, }]}>Invite Home Owner</Text>

                                                <Text style={[Style.text14, { marginBottom: 20, color: Colors.lightblack, }]}>Please enter email to invite Home Owner</Text>


                                                <View style={{ paddingVertical: "4%" }}>

                                                    <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack, }]}>Enter Email</Text>

                                                    <TextInput
                                                        style={[Style.textInput]}
                                                        onChangeText={(text) => setEmail(text)}
                                                        title="Email"
                                                        placeholderTextColor={Colors.gray_d1}
                                                        value={email}
                                                        selectionColor={Colors.TheamColor2}
                                                    />

                                                </View>

                                                <View style={[Style.buttonStyle2, { marginBottom: 30 }]}>
                                                    {iisLoding ?
                                                        <View >
                                                            <Indicator />
                                                        </View> : <TouchableOpacity
                                                            style={{ width: '100%' }}
                                                            onPress={() => {
                                                                apiCall_Invite()
                                                            }}
                                                        >
                                                            <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>Invite</Text>
                                                        </TouchableOpacity>}

                                                </View>




                                            </View>

                                        </ScrollView>
                                    </View>

                                </ScrollView>
                            </View>

                        </View>
                    </Modal>
                </ScrollView>

                {loding ?
                    <View >
                        <Indicator />
                    </View> :
                    <TouchableOpacity
                        onPress={() => {
                            validationCheck()

                        }}
                        style={[Style.buttonStyle2, { margin: 20, }]}>
                        <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Save</Text>
                    </TouchableOpacity>
                }


            </View>
            {/* </ImageBackground> */}
        </SafeAreaView >
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(22, 27, 70, 0.5)'

    },
    modalView: {
        width: '90%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 10,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2
    },
    modalView1: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },

})
export default App;
