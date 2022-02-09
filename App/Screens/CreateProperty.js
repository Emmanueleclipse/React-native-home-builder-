import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, StyleSheet, Modal, Picker, Button, SafeAreaView, View, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT, WIDTH } from '../Theme/Style';
import TextInput from '../Compoment/TextInput';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon1 from 'react-native-vector-icons/Ionicons'
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Icon3 from 'react-native-vector-icons/Entypo'
import DocumentPicker, { types, DocumentPickerOptions } from 'react-native-document-picker'
import SelectedFile from '../Compoment/SelectedFile';

const App = ({ navigation }) => {
    //admin
    const [result, setResult] = React.useState();
    const [isLoding, setLoding] = useState(false);
    const [loding, setloding] = useState(false);
    const [iisLoding, isetLoding] = useState(false);
    const [email, setEmail] = useState("");
    const [userArray, setuserArray] = useState([])
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [infoclick, setinfoclick] = useState(false);
    const [filename, setfilename] = useState('No File Choosen');
    const [pickerData, setpickerData] = useState([]);

    const [profileImage, setProfileImage] = useState();
    const [pImage, setPImage] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedValue1, setSelectedValue1] = useState('');
    const [selected, setSelected] = useState(false);
    const [date, setDate] = useState('')
    const [todate, settoDate] = useState('')

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
                setSelectedValue1(updatedCarsArray2[0].pk)

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    const apiCall_createproprty = async () => {

        if (
            validationBlank(selectedValue, "Select Property") &&
            validationBlank(date, "Select From Date") &&
            validationBlank(todate, "Select To Date") &&
            validationBlank(username, "Add Milestone")
        ) {

            var access = await AsyncStorage.getItem('access')
            setloding(true);
            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": false
            };

            var formdata = new FormData();
            formdata.append('property', selectedValue);
            formdata.append('milestone_name', username);
            formdata.append('description', password);
            formdata.append('_from', date);
            formdata.append('_to', todate);
    
            if (pImage) {
                pImage.map(file => (
                    formdata.append('attachments', file)
                ))
            }
            else {
                formdata.append('attachment', '');
            }

            Axios.post(Urls.baseUrl + 'api/activity/', formdata, { headers })
                .then(response => {
                    setloding(false);
                    if (validationempty(response.data)) {
                        showToast('Added Successfully', "success");
                        navigation.popToTop();
                        navigation.navigate('CreateProperty', {})
                    }
                }).catch(function (error) {
                    setloding(false);
                    console.log("======", error)
                    if (error.response) {
                        showToast(JSON.stringify(error.response.data) + "", "error")
                    }
                });
        }

    }

    const pickerDocument = async () => {
        DocumentPicker.pickMultiple({ type: types.allFiles })
        .then(DocumentPickerOptions => {
            let files = {}
            DocumentPickerOptions.map(file => (
                pImage.push(file)
            ))
            setPImage([...pImage])
            setSelected(DocumentPickerOptions[0].name)
            console.log('Picker', DocumentPickerOptions)
        })
        .catch(err => console.log(err))
    };
    
    console.log('Pimage', pImage)
    const clearSelection = item => {
        let currentFiles = pImage.filter(file => file.name !== item)
        setPImage([...currentFiles])
    }


    const apiCall_Invite = async () => {

        if (
            validationBlank(selectedValue1, "Select Property") &&
            validationBlank(email, "Enter Email")
        ) {

            var access = await AsyncStorage.getItem('access')
            isetLoding(true);

            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": "application/json"
            };

            var params = JSON.stringify({
                property: selectedValue,
                receiver: email,
                invitation_type: 'homeowner'
            });
            Axios.post(Urls.baseUrl + 'api/invite-send/', params, { headers })
                .then(response => {
                    isetLoding(false);
                    if (validationempty(response.data)) {
                        showToast('Invitation sent successfully !', "success");
                        setinfoclick(false);
                        navigation.popToTop();
                        navigation.navigate('CreateProperty', {})

                    }
                }).catch(function (error) {
                    isetLoding(false);
                    if (error.response) {
                        showToast(JSON.stringify(error.response.data) + "", "error")
                    }

                });
        }

    }

    let items1 = userArray.map((item, index) => {
        return (<Picker.Item key={item.pk} label={item.name} value={item.pk} />)
    })

    let items = userArray.map((item, index) => {
        return (<Picker.Item key={item.pk} label={item.name} value={item.pk} />)
    })

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

                <ScrollView >
                    <View style={{ backgroundColor: Colors.divider, flex: 1, padding: 20 }}>
                        {/* <Text style={[Style.text22, { fontFamily: CustomeFonts.Poppins_Bold, marginVertical: 20, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>New Message</Text> */}


                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 6, color: Colors.lightblack, }]}>Select Property</Text>


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
                                                setSelectedValue(itemValue)
                                            }}
                                        >
                                            {items}
                                        </Picker> :
                                        <Picker style={{ height: 50 }}></Picker>}
                                </View>
                            )}
                        </View>

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>Date</Text>

                        <View style={{ flexDirection: 'row', marginTop: 8, }}>
                            <View style={{ backgroundColor: Colors.white }}>

                                <DatePicker
                                    date={date}
                                    mode="date"
                                    placeholder="From"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Ok"
                                    cancelBtnText="Abbrechen"
                                    customStyles={{
                                        style: { backgroundColor: Colors.white },
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 4,
                                            top: 4,
                                            marginLeft: 0,
                                        },

                                        dateInput: { paddingLeft: 6, justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0 },
                                        placeholderText: {
                                            fontSize: 12,
                                            textAlign: 'left',
                                            fontFamily: CustomeFonts.Poppins_Regular,
                                            color: Colors.black
                                        }
                                    }}
                                    iconComponent={
                                        <Icon
                                            size={30}
                                            style={{ marginRight: 5 }}
                                            color='#a3a3a3'
                                            name='calendar-sharp'
                                        />
                                    }
                                    onDateChange={(date) => { setDate(date) }}

                                />


                            </View>
                            <View style={{ marginLeft: 10, backgroundColor: Colors.white }}>
                                <DatePicker
                                    date={todate}
                                    mode="date"
                                    placeholder="To"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Ok"
                                    cancelBtnText="Abbrechen"
                                    customStyles={{
                                        style: { backgroundColor: Colors.white },
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 4,
                                            top: 4,
                                            marginLeft: 0,
                                        },

                                        dateInput: { paddingLeft: 6, justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0 },
                                        placeholderText: {
                                            fontSize: 12,
                                            textAlign: 'left',
                                            fontFamily: CustomeFonts.Poppins_Regular,
                                            color: Colors.black
                                        }
                                    }}
                                    iconComponent={
                                        <Icon
                                            size={30}
                                            style={{ marginRight: 5 }}
                                            color='#a3a3a3'
                                            name='calendar-sharp'
                                        />
                                    }
                                    onDateChange={(date) => { settoDate(date) }}

                                />

                            </View>
                        </View>



                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>*Milestone</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setUserName(text)}
                            placeholderTextColor={Colors.gray_d1}
                            value={username}
                            selectionColor={Colors.TheamColor2}
                        />

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>Description</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            onChangeText={(text) => setPassword(text)}
                            numberOfLines={5}
                            multiline={true}
                            placeholderTextColor={Colors.gray_d1}
                            value={password}
                            selectionColor={Colors.TheamColor2}
                        />

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, marginBottom: 6, color: Colors.lightblack, }]}>Attachment</Text>
                        <View style={{ marginBottom: 10, flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity style={{flexDirection:'row',borderRadius:10,elevation:5,backgroundColor:Colors.TheamColor,alignItems:'center',padding:5,paddingHorizontal:10 }} onPress={pickerDocument}>
                                <Text style={[Style.text16, { borderColor: Colors.lightblack, padding: 4, marginRight: 4, }]}>Upload Files</Text>
                                <Icon3 name="attachment" color={Colors.black} size={18} />
                            </TouchableOpacity>

                        </View>
                        <View >

                        { selected && selectedFiles }
                            {/* {
                                pickerData.map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: "center", backgroundColor: 'white', elevation: 5, margin: 5, borderRadius: 10, padding: 15 }} >
                                            <Text numberOfLines={2} style={[Style.text14, { flex: 1, marginRight: 10 }]}>{index + 1}. {item.name}</Text>
                                            <TouchableOpacity onPress={() => {
                                                const filteredData = pickerData.filter(items => items !== item);
                                                setpickerData(filteredData)
                                            }} >
                                                <Icon2 name="delete" color={'red'} size={16} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            } */}

                        </View>
                        <View style={[Style.buttonStyle2, { width: '50%', marginTop: 20, }]}>
                            {loding ?
                                <View >
                                    <Indicator />
                                </View> :
                                <TouchableOpacity
                                    style={{ width: '100%' }}
                                    onPress={() => {
                                        apiCall_createproprty()
                                    }}
                                >
                                    <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>Create Activity</Text>
                                </TouchableOpacity>
                            }
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

                                                    <Text style={[Style.text22, { marginTop: 20, lineHeight: 25, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 8, color: Colors.lightblack, }]}>Invite Crew Members</Text>

                                                    <Text style={[Style.text14, { lineHeight: 16, marginBottom: 20, color: Colors.lightblack, }]}>Please enter email to invite Crew</Text>


                                                    <View style={{ paddingVertical: "4%" }}>
                                                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 6, color: Colors.lightblack, }]}>Select Property</Text>

                                                        <View style={{ borderColor: Colors.lightblack, borderWidth: 1, borderRadius: 6, }}>
                                                            {userArray.length > 0 ?
                                                                <Picker
                                                                    selectedValue={selectedValue1}
                                                                    style={{ height: 50 }}
                                                                    onValueChange={(itemValue, itemIndex) => {
                                                                        setSelectedValue1(itemValue)
                                                                    }}
                                                                >
                                                                    {items1}
                                                                </Picker> :
                                                                <Picker style={{ height: 50 }}></Picker>}
                                                        </View>

                                                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 10, color: Colors.lightblack, }]}>Enter Email</Text>

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
                                                                    // setinfoclick(false);
                                                                    // navigation.navigate('CreateProperty', {})
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


                    </View>
                </ScrollView>
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