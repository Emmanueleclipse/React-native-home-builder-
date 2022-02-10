import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, StyleSheet, Modal, Picker, Button, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import Icon1 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Icon3 from 'react-native-vector-icons/Entypo'
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker, { types } from 'react-native-document-picker'
import SelectedFile from '../Compoment/SelectedFile';


var property_id;
const App = ({ navigation }) => {
    //admin
    const [loding, setLoding] = useState(false);
    const [name, setname] = useState('');
    const [address, setaddress] = useState('');
    const [city, setcity] = useState('');
    const [statedata, setstatedata] = useState('');
    const [zipcode, setzipcode] = useState('');
    const [iisLoding, isetLoding] = useState(false);
    const [email, setEmail] = useState("");
    const [infoclick, setinfoclick] = useState(false);
    const [filename, setfilename] = useState('');
    const [pImage, setPImage] = useState([]);
    const [inviteSuccessModal, setInviteSuccessModal] = useState(false);
    const [selected, setSelected] = useState([])

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

        const formdata = new FormData();
        
        formdata.append('name', name);
        formdata.append('address', address);
        formdata.append('city', city);
        formdata.append('state', statedata);
        formdata.append('zip_code', zipcode);
        if(pImage){
            formdata.append('attachments', pImage[0])
        } else {
            formdata.append('attachments', '')
        }
        const headers = {
            'Authorization': 'Bearer ' + access,
            "Content-type": false,
        };
        
        Axios.post(Urls.baseUrl + 'api/property/', formdata, { headers: headers })
            .then(response => {
                setLoding(false);
                if (validationempty(response.data)) {
                    showToast('Added Successfully', "success");
                    property_id = response.data.pk + "";
                    setinfoclick(true)
                }
            }).catch(function (error) {
                setLoding(false);
                console.log("======", error)
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }

            });

    };

    const apiCall_Invite = async () => {

        if (validationBlank(email, "Enter Email")) {
            var access = await AsyncStorage.getItem('access')
            isetLoding(true);

            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": "application/json"
            };

            var params = JSON.stringify({
                property: property_id,
                receiver: email,
                invitation_type:'homeowner'
            });

            Axios.post(Urls.baseUrl + 'api/invite-send/', params, { headers })
                .then(response => {
                    isetLoding(false);
                    if (validationempty(response.data)) {
                        // showToast('Invitation sent successfully !', "success");
                        setInviteSuccessModal(true);
                        // navigation.popToTop();
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

    const captureFile = async () => {
        DocumentPicker.pickSingle({
            type: types.images 
        })
            .then(DocumentPickerOptions => {
                setfilename(DocumentPickerOptions.name)
                setPImage([...pImage,DocumentPickerOptions])
                setSelected([...selected,DocumentPickerOptions.name])
                // console.log('picker', DocumentPickerOptions)
            })
            .catch(err => console.log("Error", err))
    };

    const clearSelection = item => {
        let currentFiles = pImage.filter(file => file.name !== item)
        setPImage([...currentFiles])
    }

    const selectedFiles =  pImage.map((image, i) => (
        <SelectedFile key={i} fileName={image.name} onPress={() => clearSelection(image.name)}/>
    ))

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


                        <Text style={[Style.text22, { lineHeight: 25, marginBottom: 30, fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack }]}>Create Property</Text>


                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>Property Name</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setname(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={name}
                            title='eg: James bathroom remodel'
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
                            keyboardType="numeric"
                            title='Zip Code'
                            selectionColor={Colors.TheamColor2}
                        />
                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, marginBottom: 6, color: Colors.lightblack, }]}>Select Photo</Text>
                        <View style={{ marginBottom: 10, flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity style={{flexDirection:'row',borderRadius:10,elevation:5,backgroundColor:Colors.TheamColor,alignItems:'center',padding:5,paddingHorizontal:10 }} onPress={captureFile}>
                                <Text style={[Style.text16, { borderColor: Colors.lightblack, padding: 4, marginRight: 4, }]}>Upload File</Text>
                                <Icon3 name="attachment" color={Colors.black} size={18} />
                            </TouchableOpacity>
                        </View>
                        { selected && selectedFiles }
                    </View>


                    <Modal
                        useNativeDriver={false}
                        animationType="slide"
                        transparent={true}
                        visible={infoclick}
                        onRequestClose={() => {
                            setinfoclick(!infoclick);
                            navigation.popToTop();
                        }}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView1}>
                                <ScrollView contentContainerStyle={styles.modalView}>

                                    <View style={[Style.cointainer, { justifyContent: 'center', padding: '3%' }]}>
                                        <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                            <Icon onPress={() => {
                                                setinfoclick(false)
                                                navigation.popToTop();
                                            }}
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


                    <Modal
                        useNativeDriver={false}
                        animationType="slide"
                        transparent={true}
                        visible={inviteSuccessModal}
                        onRequestClose={() => {
                            setInviteSuccessModal(!inviteSuccessModal);
                            navigation.popToTop();
                        }}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView1}>
                                <ScrollView contentContainerStyle={styles.modalView}>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                                <Icon onPress={() => {
                                                    setInviteSuccessModal(false)
                                                }}
                                                    name={'close'} type={'ionicon'} size={25} color={Colors.gray} />
                                            </View>
                                    <View style={[Style.cointainer, { justifyContent: 'center' }]}>
                                        <Text style={[Style.text22, { lineHeight: 35, textAlign: "center", marginTop: 20, paddingHorizontal: 10, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 30, color: Colors.lightblack, }]}>Invitation Sent Successfully</Text>

                                        <ScrollView contentContainerStyle={{ flex: 1, padding: 10 }}>
                                            <TouchableOpacity onPress={() => { navigation.navigate('CreateProperty'), setInviteSuccessModal(false) }} style={{ backgroundColor: Colors.TheamColor2, alignItems: 'center', borderRadius: 10 }}>

                                                <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, color: Colors.white, paddingVertical: 15 }]}>Click Here to Add Milestone</Text>

                                            </TouchableOpacity>

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
