import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text, ScrollView,
    View,
    Image,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT } from '../Theme/Style';
import { ListItem, Icon } from 'react-native-elements'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'


const Home = ({ navigation, route }) => {
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])

    useEffect(() => {
        apiCall_list()
    }, []);

    const apiCall_list = async () => {
        var access = await AsyncStorage.getItem('access')
        var pk = await AsyncStorage.getItem('pk')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        Axios.get(Urls.baseUrl +'payments/subscription-plans/', { headers })
            .then(response => {
                setLoding(false);
                console.log("======plans", response.data)
                if(response.data[0].subscription_type === 'free') {
                    setuserArray(response.data.slice(1))
                }
                else {
                    setuserArray(response.data)
 
                }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }

            });
        };

    return (
        <SafeAreaView style={Style.cointainer}>

            {isLoding ? (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                <View style={{ padding: 15, flex: 1 }}>
                    <TouchableOpacity style={{
                        justifyContent: 'flex-start', alignItems: 'flex-start'
                    }}>
                        <Icon name={'arrow-back-outline'} type={'ionicon'} size={30}
                            onPress={() => { navigation.goBack() }} />
                    </TouchableOpacity>

                    <Text style={[Style.text22, { lineHeight: 25, marginTop: 20, fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack ,textAlignVertical: "center", textAlign: 'center'}]}>Purchase Credit</Text>
                    <Text style={[Style.text14, { marginVertical: 20, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Simple Prices. Serious Value. All plans come with a risk-free 30-day free trial. Get started below!</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, }}>

                            {/* <TouchableOpacity
                                style={{
                                    borderWidth: 1, borderColor: Colors.divider, marginTop: 10,
                                    padding: 10, flexDirection: 'column', borderRadius: 8, backgroundColor: Colors.divider,
                                }}>

                                <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'transparent', size: 20 }}>
                                    <Icon name={'ghost'} type={'simple-line-icon'} size={22} color={Colors.lightblack} style={{ marginRight: 10 }} />
                                    <Text style={[Style.text18, { marginTop: 4 }]}>Day Pass</Text>

                                </View>

                                <Text style={[Style.text12, { marginLeft: 6, marginTop: 4, color: Colors.gray }]}>What You'll Get</Text>

                                <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'transparent', size: 20 }}>
                                    <Icon name={'checkmark-circle'} type={'ionicon'} size={20} color={Colors.lightblack} style={{ marginRight: 10 }} />
                                    <Text style={[Style.text14, { marginTop: 4 }]}>8 hours usage of our coworking space</Text>

                                </View>


                                <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'transparent', size: 20 }}>
                                    <Icon name={'checkmark-circle'} type={'ionicon'} size={20} color={Colors.lightblack} style={{ marginRight: 10 }} />
                                    <Text style={[Style.text14, { marginTop: 4 }]}>Access to All our rooms</Text>

                                </View>



                            </TouchableOpacity> */}

                            <FlatList
                                // style={{ borderRadius: 8, backgroundColor: Colors.divider }}
                                showsVerticalScrollIndicator={false}
                                data={userArray}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate('Payment', { subscription_type: item.subscription_type }) }}
                                        style={{
                                            borderWidth: 1, borderColor: Colors.divider, marginTop: 10,
                                            padding: 10, flexDirection: 'column', borderRadius: 8, backgroundColor: Colors.divider,
                                        }}>
                                        <Text style={[Style.text12, { marginLeft: 6, marginTop: 4, color: Colors.gray }]}>{item.description}</Text>

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[Style.text18, { marginTop: 10, marginLeft: 8 }]}>{item.amount}
                                                    <Text style={[Style.text14, { lineHeight: 24, color: Colors.TheamColor2 }]}> /{item.subscription_type}</Text>
                                                </Text>
                                            </View>
                                            <Icon name={'ios-chevron-forward'} type={'ionicon'} size={20}
                                                color={Colors.lightblack} style={{ marginTop: 4, justifyContent: 'center', alignItems: 'center' }}
                                            />
                                        </View>

                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={<NoData />}
                            />

                            {/* <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Payment', {})
                                }}
                                style={[Style.buttonStyle2, { width: '100%', marginTop: 20, justifyContent: 'center', alignSelf: 'center' }]}>
                                <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Choose</Text>
                            </TouchableOpacity> */}

                        </View>
                    </ScrollView>
                </View>
                // </ScrollView>
            )
            }
        </SafeAreaView >
    );
};

const Data = [
    {
        iname: 'image',
        itype: 'entypo',
        name: 'Photos',

    },
    {
        iname: 'chart',
        itype: 'evilicon',
        name: 'Reports',

    },
    {
        iname: 'chart',
        itype: 'evilicon',
        name: 'Reports',

    }, {
        iname: 'chart',
        itype: 'evilicon',
        name: 'Reports',

    },




];

export default Home;


