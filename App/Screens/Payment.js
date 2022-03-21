import React, { useState, useEffect } from "react";
import {
    Picker,
    SafeAreaView,
    View,
    Image, StyleSheet,
    Text,
    Linking,
    TouchableOpacity,
} from "react-native";
import Colors from "../Theme/Colors";
import Images from "../Theme/Images";
import CustomeFonts from "../Theme/CustomeFonts";
import Style, { HEIGHT, WIDTH } from "../Theme/Style";
import TextInput from "../Compoment/TextInput";
import { ScrollView } from "react-native-gesture-handler";
import { ListItem, Icon } from 'react-native-elements'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import CountryPicker from 'react-native-country-picker-modal'

const App = ({ navigation, route }) => {
    const { subscription_type } = route.params;
    const [isLoding, setLoding] = useState(false);
    const [loding, setloding] = useState(false);
    const [cardname, setcardname] = useState("");
    const [cardnumber, setcardnumber] = useState("");
    const [cvcnum, setcvcnum] = useState("");
    const [fullname, setfullname] = useState("");
    const [billaddress, setbilladdress] = useState("");
    const [city, setcity] = useState("");
    const [zipcode, setzipcode] = useState("");
    const [selected, setselected] = useState('1');
    const [selectedValue, setSelectedValue] = useState(Data[0].name);
    const [yearArray, setyearArray] = useState([]);
    const [selectedValueyear, setSelectedValueyear] = useState('');
    const [country, setcountry] = useState('')


    useEffect(() => {

        let currentYear = new Date().getFullYear();
        var yearyr = [];
        for (let index = 0; index < 10; index++) {
            const obj = { 'name': (currentYear + index) + "" };
            yearyr.push(obj)
        }
        setyearArray(yearyr);

    }, [])

    let items = Data.map((item, index) => {
        return (<Picker.Item key={item.name} label={Datam[index]} value={item.name} />)
    })
    let items1 = yearArray.map((item, index) => {
        return (<Picker.Item key={item.name} label={item.name} value={item.name} />)
    })

    const apiCall_payment = async () => {

        if (selected == "1") {
            if (
                validationBlank(cardname, "Enter Card Holder Name") &&
                validationBlank(cardnumber, "Enter Card Number") &&
                validationBlank(cvcnum, "Enter CVC Number") &&
                validationBlank(fullname, "Enter Full Name") &&
                validationBlank(billaddress, "Enter Adress") &&
                validationBlank(country, "Select Country")

            ) {
                apiCall_payment_Done()
            }
        }
        else {
            apiCall_payment_Done()
        }

    }

    const apiCall_payment_Done = async () => {

        var access = await AsyncStorage.getItem('access')
        setloding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };



        console.log(params);
        var url;
        if (selected == "1") {
            if (selectedValueyear.length < 4) {
                showToast('Please add valid expiry year', "error");
            }
            else {
                url = Urls.baseUrl + 'payments/stripe-subscription/'
                var params = JSON.stringify({
                    "subscription_type": subscription_type,
                    "card_holder_name": cardname,
                    "card_number": cardnumber,
                    "expiration_month": (selectedValue) < 10 ? `0${selectedValue}` : `${selectedValue}`,
                    "expiration_year": selectedValueyear,
                    "cvc": cvcnum,
                    "city": city,
                    "country": country,
                    "billing_address": billaddress,
                    "zip_code": zipcode
                });
            }

        }
        else {
            url = Urls.baseUrl + 'payments/paypal-subscription/'
            var params = JSON.stringify({
                "subscription_type": subscription_type
            });
        }
        console.log("url====>", url)
        console.log("params", params)
        Axios.post(url + "", params, { headers })
            .then(response => {
                console.log("======paypal===>", response)
                setloding(false);
                if (validationempty(response.data)) {
                    navigation.popToTop();
                    if (validationempty(response.approve_link)) {
                        navigation.navigate('WebLoad', { linkname: response.data.approve_link })
                    }
                    else {
                        showToast(JSON.stringify(response.data.message), "success");
                    }
                }
            }).catch(function (error) {
                setloding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });
    }
    const handleCardNumber = text => {
        let formattedText = text.split('-').join('');
        if (formattedText.length > 0) {
          formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join('-');
        }
        setcardnumber(formattedText);
        return formattedText;
      };
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={[Style.cointainer, { padding: 20 }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View >
                        <Text style={[Style.text22, { marginTop: 20, lineHeight: 25, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 8, color: Colors.lightblack, }]}>Payment</Text>
                        <Text style={[Style.text16, { lineHeight: 25, marginBottom: 20, color: Colors.lightblack, }]}>Choose Payment method below</Text>

                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>

                            <TouchableOpacity onPress={() => { setselected('1') }} style={selected === '1' ? styles.image_gender_selected : styles.image_gender_unselected}>
                                <Image style={styles.image_gender} source={require('../../assets/ic_card.png')} />
                            </TouchableOpacity>

                            <View style={{ marginHorizontal: 5 }} />

                            <TouchableOpacity onPress={() => { setselected('2') }} style={selected === '2' ? styles.image_gender_selected : styles.image_gender_unselected}>
                                <Image style={[styles.image_gender,]} source={require('../../assets/paypal.png')} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', size: 20 }}>
                            <Text style={[Style.text12, { marginRight: 10, width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 1, borderColor: Colors.TheamColor2, justifyContent: 'center', textAlignVertical: 'center', textAlign: 'center', paddingTop: 4 }]}>1</Text>
                            <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 4 }]}>Credit Card info</Text>

                        </View>

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>CARDHOLDERS NAME</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            onChangeText={(text) => setcardname(text)}
                            value={cardname}
                        />

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>CARD NUMBER</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            keyboardType='numeric'
                            onChangeText={(text) => handleCardNumber(text) }
                            value={cardnumber}
                        />

                        <View style={{ marginTop: 15, flexDirection: 'row' }}>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, color: Colors.lightblack, }]}>EXP MONTH</Text>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, color: Colors.lightblack, }]}>EXP YEAR</Text>

                        </View>
                        <View style={{ marginTop: 5, alignItems: "center", flexDirection: 'row' }}>

                            <View style={[{
                                borderColor: Colors.lightblack, flex: 1, marginRight: 6, borderWidth: 1, borderRadius: 4,
                            }]}>

                                <Picker
                                    selectedValue={selectedValue}
                                    style={{ height: 55 }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedValue(itemValue)
                                        console.log(selectedValue)
                                    }}
                                >
                                    {items}
                                </Picker>
                            </View>



                            <TextInput
                                maxLength={4}
                                style={{
                                    height: 50, marginBottom: 20, borderColor: Colors.lightblack, flex: 1, marginRight: 8, borderRadius: 4,
                                }}
                                placeholderTextColor={Colors.gray_d1}
                                placeholder={'eg: 2022'}
                                keyboardType='numeric'
                                onChangeText={(text) => setSelectedValueyear(text)}
                                value={selectedValueyear}
                            />
                            {/* <Picker
                                    selectedValue={selectedValueyear}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedValueyear(itemValue)
                                    }}
                                >
                                    {items1}
                                </Picker> */}


                        </View>

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>CVC NUMBER</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            keyboardType='numeric'
                            onChangeText={(text) => setcvcnum(text)}
                            value={cvcnum}
                        />


                        {/* BILLING INFO */}


                        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginTop: 30 }}>
                            <Text style={[Style.text12, { marginRight: 10, width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 1, borderColor: Colors.TheamColor2, justifyContent: 'center', textAlignVertical: 'center', textAlign: 'center', paddingTop: 4 }]}>2</Text>
                            <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 4 }]}>Billing info</Text>

                        </View>

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 20, color: Colors.lightblack, }]}>FULL NAME</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            onChangeText={(text) => setfullname(text)}
                            value={fullname}
                        />

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>BILLING ADDRESS</Text>
                        <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            onChangeText={(text) => setbilladdress(text)}
                            value={billaddress}
                        />

                        <View style={{ marginTop: 15, flexDirection: 'row' }}>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, color: Colors.lightblack, }]}>CITY</Text>

                            <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, color: Colors.lightblack, }]}>ZIP CODE</Text>

                        </View>
                        <View style={{ marginTop: 5, flexDirection: 'row' }}>

                            <TextInput style={[Style.textInput, { marginTop: 0, flex: 1, marginRight: 4 }]}
                                placeholderTextColor={Colors.gray_d1}
                                selectionColor={Colors.TheamColor2}
                                onChangeText={(text) => setcity(text)}
                                value={city}
                            />

                            <TextInput style={[Style.textInput, { marginTop: 0, flex: 1, marginLeft: 4 }]}
                                placeholderTextColor={Colors.gray_d1}
                                selectionColor={Colors.TheamColor2}
                                keyboardType='numeric'
                                onChangeText={(text) => setzipcode(text)}
                                value={zipcode}
                            />

                        </View>

                        <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginTop: 15, color: Colors.lightblack, }]}>COUNTRY</Text>
                        {/* <TextInput style={[Style.textInput, { marginTop: 0 }]}
                            placeholderTextColor={Colors.gray_d1}
                            selectionColor={Colors.TheamColor2}
                            onChangeText={(text) => setcountry(text)}
                            value={country}
                        /> */}

                        <View style={{ borderColor: Colors.lightblack, borderWidth: 1, height: 50, borderRadius: 6, justifyContent: 'center', paddingLeft: 10 }}>
                            <CountryPicker
                                countryCode={country}
                                withFilter
                                withFlag
                                withCountryNameButton={true}
                                // withCallingCodeButton
                                // withAlphaFilter
                                // withCallingCode
                                // withEmoji
                                onSelect={(country) => {
                                    setcountry(country.cca2)
                                    console.log(country.cca2)
                                }}
                                visible={false}
                                filterProps={{ placeholder: 'Enter country name...' }}
                            />
                        </View>

                        <View style={[Style.buttonStyle2, { marginTop: 15, }]}>
                            {loding ?
                                <View >
                                    <Indicator />
                                </View> :
                                <TouchableOpacity
                                    style={{ width: '100%' }}
                                    onPress={() => {
                                        apiCall_payment()
                                    }}
                                >
                                    <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>PROCEED</Text>
                                </TouchableOpacity>

                            }
                        </View>




                    </View>

                </ScrollView>
            </View >
        </SafeAreaView >
    );
};

const Data = [
    {
        name: '1',
    },
    {
        name: '2',
    },
    {
        name: '3',
    },
    {
        name: '4',
    },
    {
        name: '5',
    },
    {
        name: '6',
    },
    {
        name: '7',
    },
    {
        name: '8',
    },
    {
        name: '9',
    },
    {
        name: '10',
    },
    {
        name: '11',
    },
    {
        name: '12',
    },



];
const Datam = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const styles = StyleSheet.create({


    image_gender: {
        resizeMode: 'contain',
        height: 60, width: 100,
        backgroundColor: '#f9fcff',
        margin: 6, alignSelf: 'center',
    },
    image_gender_selected: {
        borderWidth: 1, borderRadius: 4,
        borderColor: Colors.TheamColor2,
        backgroundColor: '#f9fcff', elevation: 1,
        flex: 1, justifyContent: 'center',
    },
    image_gender_unselected: {
        backgroundColor: '#f9fcff', borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.divider, elevation: 1,
        flex: 1, justifyContent: 'center',
    },

})
export default App;