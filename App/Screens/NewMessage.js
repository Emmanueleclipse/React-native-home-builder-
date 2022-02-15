import React, { useEffect, useState } from 'react';
import { Picker, Button, PermissionsAndroid, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/Ionicons'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from 'react-native-document-picker';
import Icon3 from 'react-native-vector-icons/Entypo'


const Login = ({ navigation }) => {
    //admin
    const [isLoding, setLoding] = useState(false);
    const [loding, setloding] = useState(false);
    const [filename, setfilename] = useState('');
    const [profileImage, setProfileImage] = useState({});
    const [pImage, setPImage] = useState("");
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [desc, SetDesc] = useState('');
    const [userArray, setuserArray] = useState([])
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        apiCall_proprtylist()
    }, [])

    const apiCall_proprtylist = async () => {
        var access = await AsyncStorage.getItem('access')
        var pk = await AsyncStorage.getItem('pk')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        Axios.get(Urls.baseUrl + 'api/property/', { headers })
            .then(response => {
                setLoding(false);

                var cars = response.data;
                const newCar = {
                    pk: '',
                    name: 'Select Property'
                }
                const updatedCarsArray2 = [...cars, newCar].sort(function (a, b) { return a.pk - b.pk });
                setuserArray(updatedCarsArray2)
                setSelectedValue(updatedCarsArray2[0].pk)
                setEmail('')

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    const apiCall_createmessage = async () => {

        var access = await AsyncStorage.getItem('access')
        setloding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };

        var formdata = new FormData();
        formdata.append('property', selectedValue);
        formdata.append('send_to', email);
        formdata.append('subject', username);
        formdata.append('message', desc);
        // formdata.append('attachment', profileImage);
        if (validationempty(pImage)) {
            formdata.append('attachment', profileImage);
        }
        else {
            formdata.append('attachment', '');
        }
    
        Axios.post(Urls.baseUrl + 'api/messages/', formdata, { headers })
            .then(response => {
                setloding(false);
                if (validationempty(response.data)) {
                    showToast('Added Successfully', "success");
                    navigation.goBack();
                }
            }).catch(function (error) {

                setloding(false);
                if (error.response) {
                    if (validationempty(error.response.data.send_to)) {
                        showToast(JSON.stringify(error.response.data.send_to[0]) + "", "error")
                    }
                    else {
                        showToast(JSON.stringify(error.response.data.detail) + "", "error")

                    }
                }
            });

    }

    const validationCheck = () => {
        if (
            validationBlank(selectedValue, "Select Property") &&
            validationBlank(email, "Please Enter Email") &&
            validationBlank(username, "Please Enter subject") &&
            validationBlank(desc, "Please Enter message")
        ) {
            apiCall_createmessage()
        }
    };

    const selectImage = async () => {
        if (Platform.OS === 'ios') {

        } else {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            // alert(granted)

            console.log("granted", "granted")
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Pick multiple files
                try {
                    const res = await DocumentPicker.pickMultiple({
                        type: [DocumentPicker.types.images,
                        DocumentPicker.types.pdf,
                        DocumentPicker.types.doc,
                        DocumentPicker.types.docx
                        ],
                    });

                    setPImage(res.uri);
                    setProfileImage({
                        uri: res.uri,
                        name: res.name,
                        type: res.type,
                    });
                    setfilename(res.name);

                } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                        // User cancelled the picker, exit any dialogs or menus and move on
                    } else {
                        throw err;
                    }
                }
            } else {
                showToast("No permission", "info")

            }
        }
    }

    const CapturePhoto = async () => {
        const options = {
            title: "Select Image",
            takePhotoButtonTitle: "Take Photo",
            chooseFromLibraryButtonTitle: "Choose From Gallery",
            quality: 1,
            maxWidth: 500,
            maxHeight: 500,
            noData: true,
            saveToPhotos: false,
        };

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera ",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log("responce didCancel");
                }
                 else if (response.error) {
                    console.log("responce error");
                } 
                else {
                    const source = response.uri;
                    console.log("response.type", response.type);
                    console.log(response);
                    setPImage(source);
                    setProfileImage({
                        uri: response.uri,
                        name: response.fileName,
                        type: response.type,
                    });
                    setfilename(response.fileName);
                }
            });
        } else {
            console.log("Camera permission denied");
        }
    };

    let items = userArray.map((item, index) => {
        return (<Picker.Item key={item.pk} label={item.name} value={item.pk} />)
    })

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={[Style.cointainer, { backgroundColor: Colors.white, padding: '3%' }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, padding: 10 }}>

                        <TouchableOpacity style={{
                            justifyContent: 'flex-start', alignItems: 'flex-start'
                        }}>
                            <Icon1 name={'arrow-back-outline'} type={'ionicon'} size={30}
                                onPress={() => { navigation.goBack() }} />
                        </TouchableOpacity>

                        <Text style={[Style.text22, { fontFamily: CustomeFonts.Poppins_Bold, marginVertical: 20, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>New Message</Text>

                        <View style={{ borderRadius: 8, backgroundColor: Colors.divider, flex: 1, padding: 20, marginTop: 20 }}>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginVertical: 6, color: Colors.lightblack, }]}>Property</Text>

                            <View style={[{
                                paddingLeft: '1%', width: '70%',
                                backgroundColor: Colors.white, marginBottom: 10
                            }]}>
                                {isLoding ? (
                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Indicator></Indicator>
                                    </View>
                                ) : (
                                    <View>
                                        {userArray.length > 0 ?
                                            <Picker
                                                selectedValue={selectedValue}
                                                style={{ height: 50 }}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    console.log(itemIndex)
                                                    setSelectedValue(itemValue)
                                                    if (itemIndex == 0) {
                                                        setEmail('')
                                                    }
                                                    else {
                                                        if (LocalData.FLAG == '1') {
                                                            setEmail(userArray[itemIndex].homebuilder)
                                                        }
                                                        else {
                                                            userArray[itemIndex].homeowner==null?showToast("This user has not accepted the invite, you cannot message them yet", 'error'):null
                                                            setEmail(userArray[itemIndex].homeowner)
                                                        }
                                                    }

                                                }}
                                            >
                                                {items}
                                            </Picker> :
                                            <Picker style={{ height: 50 }}></Picker>
                                        }
                                    </View>
                                )}
                            </View>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>Send to</Text>
                            <TextInput style={[Style.textInput, { marginTop: 0 }]}
                                onChangeText={(text) => setEmail(text)}
                                placeholderTextColor={Colors.gray_d1}
                                value={email}
                                editable = {false}
                                selectionColor={Colors.TheamColor2}
                            />


                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>Subject</Text>
                            <TextInput style={[Style.textInput, { marginTop: 0 }]}
                                onChangeText={(text) => setUserName(text)}
                                placeholderTextColor={Colors.gray_d1}
                                value={username}
                                selectionColor={Colors.TheamColor2}
                            />

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>Message</Text>
                            <TextInput style={[Style.textInput, { marginTop: 0 }]}
                                onChangeText={(text) => SetDesc(text)}
                                numberOfLines={5}
                                multiline={true}
                                placeholderTextColor={Colors.gray_d1}
                                value={desc}
                                selectionColor={Colors.TheamColor2}
                            />


                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, marginBottom: 6, color: Colors.lightblack, }]}>Attachment</Text>
                            {/* <View style={{ marginBottom: 10, flexDirection: 'row', width: '100%' }}>
                                <TouchableOpacity onPress={() => selectImage()}><Text style={[Style.text16, { borderWidth: 1, borderColor: Colors.lightblack, padding: 4, marginRight: 4, }]}>Choose File</Text>
                                </TouchableOpacity><Text style={[Style.text14, { textAlignVertical: 'center', flex: 7, marginLeft: 6 }]}>{filename}</Text>
                            </View> */}

                    <View style={{ marginBottom: 10, flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity style={{flexDirection:'row',borderRadius:10,elevation:5,backgroundColor:Colors.TheamColor,alignItems:'center',padding:5,paddingHorizontal:10 }} onPress={() => CapturePhoto()}>
                                <Text style={[Style.text16, { borderColor: Colors.lightblack, padding: 4, marginRight: 4, }]}>Upload File</Text>
                                <Icon3 name="attachment" color={Colors.black} size={18} />
                            </TouchableOpacity>
                        </View>
                      <Text style={[Style.text14, { textAlignVertical: 'center', flex: 7, marginLeft: 6 }]}>{filename}</Text>


                            <View style={[Style.buttonStyle2, { width: '50%', marginTop: 20, }]}>
                                {loding ?
                                    <View >
                                        <Indicator />
                                    </View> :
                                    <TouchableOpacity
                                        style={{ width: '100%' }}
                                        onPress={() => {
                                            validationCheck()

                                        }}>
                                        <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>SEND</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View>
            {/* </ImageBackground> */}
        </SafeAreaView >
    );

}

const Data = [
    {
        Time: '120 green St.',

    },
    {
        Time: '120 green St1.',

    }, {
        Time: '120 green St2.',

    }, {
        Time: '120 green St3.',

    },


];

export default Login;