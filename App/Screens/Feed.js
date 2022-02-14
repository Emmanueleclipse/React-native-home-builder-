import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
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
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { ListItem, Icon } from 'react-native-elements'
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import { useIsFocused } from '@react-navigation/native'
import Moment from 'moment';
import { WebView } from 'react-native-webview';
import firebase from '../../firebase';
import Images from '../Theme/Images';
Images


const Home = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])
    const [linkname, setlinkname] = useState('')

    const getToken = async () => {
        let b = await AsyncStorage.getItem("is_token_register")
        if (b == '0')
            firebase.messaging().getToken().then((token) => {
                console.log("App_push_call:1", token);
                if (validationempty(token)) {
                    Apitokensend(token)
                }
            });

        firebase.messaging().onTokenRefresh((token) => {
            console.log("App_push_call:2", token);
            if (validationempty(token)) {
                Apitokensend(token)
            }
        });
    }

    const Apitokensend = async (token) => {
        var access = await AsyncStorage.getItem('access')
        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };

        const params = JSON.stringify({
            "device_token": token,
            "device_type": Platform.OS + '',

        });
        console.log("======", params);
        Axios.post(Urls.baseUrl + Urls.notificationa, params,
            { headers })
            .then(async function (response) {
                await AsyncStorage.setItem("is_token_register", '1');
                console.log("====== toekm :- ", response);
            })
            .catch(function (error) { });
    }

    useEffect(() => {
        console.log(JSON.stringify(userArray))
        // showToast("Hello","success")
        getToken()
        setlinkname('')
        apiCall_proprtylist()
    }, [isFocused]);

    useEffect(() => { }, [linkname]);

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
                // console.log("===", response)
                if (response.data != null) {
                    let data = []
                    response.data.map((item, index) => {

                        if (item.activities.length > 0) {

                            var myDate = new Date(item.activities[0]._from);
                            item.activities[0]._from = myDate.getTime();
                            // console.log(myDate.getTime())
                            data.push(item)

                        }

                    })
                    console.log('>>>> ',JSON.stringify(data))

                    data.sort(function (a, b) {
                        return a.activities[0]._from - b.activities[0]._from
                    })
                    setuserArray(data)

                    // var diffdate = new Date(response.data.activities[0]._from);
                    // var myDate = response.data.activities[0]._from;
                    // myDate = myDate.split("-");
                    // var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);
                    console.log('ssssssssssssssssss', JSON.stringify(response.data))
                    //   const datee = response.data.activities[0]._from.sort(function (a, b) {
                    //         var distancea = Math.abs(diffdate - new Date(a));
                    //         var distanceb = Math.abs(diffdate - new Date(b));
                    //         return distancea - distanceb; // sort a before b when the distance is smaller
                    //     });

                }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(error.response.data.detail + "", "error")
                }
            });

    };
    console.log('::ss: ', JSON.stringify(userArray))

    return (
        <SafeAreaView style={Style.cointainer}>

            <Text style={[Style.text16, { backgroundColor: Colors.divider, fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Feed</Text>

            {isLoding ? (
                <View style={{ alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                userArray.length === 0 && LocalData.FLAG !== '1' ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }} >
                          {/* <NoData itemtext="No activity"/>   */}
                          {/* <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginVertical: '20%' }}> */}
            <Image source={Images.nodata} style={{ height: 120, width: 250 }} resizeMode='contain' />
            <Text style={[Style.text12, { width: '100%', textAlign: "center" }]}>No activity</Text>
        {/* </View> */}
                        <TouchableOpacity
                            onPress={() => {

                                navigation.navigate('CreateProperty1')

                            }}
                            style={{ height: 40, marginTop:40, marginLeft:20,  margin: 3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 4, backgroundColor: Colors.TheamColor3 }}>
                            <Text style={[Style.text14, { textAlignVertical: 'center', textAlign: 'center', color: Colors.white }]}>Get started</Text>
                        </TouchableOpacity>
                    </View>

                    :
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={userArray}
                            renderItem={({ item, index }) => (
                                <View style={{ paddingHorizontal: 10, flexDirection: 'column', marginHorizontal: 10, marginVertical: 3, borderRadius: 5, elevation: 5, backgroundColor: 'white' }}>
                                    {validationempty(item.activities) ?
                                        <View >
                                            <Text style={[Style.text14, { alignSelf: "center", backgroundColor: Colors.TheamColor, color: Colors.black, padding: 8, }]}  >{Moment(new Date()).format('MMMM DD') === Moment(item.activities[0]._from).format('MMMM DD') ? "Today" : Moment(item.activities[0]._from).format('MMMM DD')}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: 5, paddingTop: 10 }}>
                                                <View style={{ flex: 1 }} >
                                                    <Text style={[Style.text16, {
                                                        justifyContent: 'center', textAlignVertical: 'center', fontFamily: CustomeFonts.Poppins_Bold
                                                    }]}>{item.name}</Text>
                                                    <View style={{ flex: 1, paddingVertical: 2 }} >
                                                        <Text style={[Style.text14, {
                                                            justifyContent: 'center', textAlignVertical: 'center', fontFamily: CustomeFonts.Poppins_Regular
                                                        }]}>{item.address}</Text>
                                                    </View>
                                                </View>
                                                <View  >
                                                    <Text style={[Style.text16, {
                                                        justifyContent: 'center', color: Colors.TheamColor2, backgroundColor: Colors.lightGreen, paddingHorizontal: 10, padding: 5, borderRadius: 2, fontFamily: CustomeFonts.Poppins_Regular
                                                    }]}>{item.activities[0].status}</Text>
                                                    {
                                                        item.image ?
                                                            <Image
                                                                resizeMode='cover'
                                                                style={{
                                                                    width: 90, height: 70, margin: 5
                                                                }}
                                                                source={
                                                                    validationempty(item.image) ?
                                                                        { uri: Urls.imageUrl + item.image }
                                                                        : require('../../assets/logo.png')} />
                                                            : null
                                                    }

                                                </View>
                                            </View>
                                            {/* <View style={{ marginTop: 10, height: 3, width: '100%', backgroundColor: Colors.divider }}></View> */}
                                        </View>
                                        : null}
                                    {validationempty(item.activities) ?
                                        // <FlatList
                                        //     showsVerticalScrollIndicator={false}
                                        //     data={item.activities.slice(0, 1)}
                                        //     renderItem={({ item, index }) => (

                                        <View
                                        >
                                            <View style={{ flexDirection: 'row', paddingBottom: 6 }}>

                                                <View style={{
                                                    flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column'
                                                }}>
                                                    <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                                            <View style={{ flexDirection: "row", alignItems: "center" }} >
                                                                <Text style={[Style.text16, { textDecorationLine: "underline", fontFamily: CustomeFonts.Poppins_SemiBold }]}>Milestone</Text>
                                                                <Text style={{ textDecorationLine: "none" }} > : 1</Text>

                                                            </View>

                                                            <Text style={[Style.text12, { flex: 2, paddingVertical: 3, fontFamily: CustomeFonts.Poppins_Regular }]}>{item.activities[0].milestone_name}</Text>
                                                            <Text numberOfLines={2} style={[Style.text12, { flex: 2, marginVertical: 6, marginTop: 20, color: Colors.gray }]}>{item.activities[0].description}</Text>
                                                        </View>
                                                        {/* <Text style={[Style.text12, { marginTop: 4, color: Colors.TheamColor2, textAlign: 'right', justifyContent: 'flex-end', textAlignVertical: 'top', }]}>{item.status}</Text> */}
                                                    </View>



                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                        <View style={{ flex: 3.5 }}>
                                                            {/* {validationempty(item.attachment) ?
                                                                    <View>
                                                                        {(item.attachment).endsWith('.doc') ||
                                                                            (item.attachment).endsWith('.docx') ||
                                                                            (item.attachment).endsWith('.pdf') ?
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    setlinkname(Urls.imageUrl + item.attachment)
                                                                                    // navigation.navigate('WebLoad', { linkname: Urls.imageUrl + item.attachment })
                                                                                }}>
                                                                                <Text style={[Style.text12, {
                                                                                    width: 170, textAlignVertical: 'bottom', alignSelf: 'center',
                                                                                    justifyContent: 'center', textAlign: 'center',
                                                                                    textDecorationLine: 'underline', color: Colors.TheamColor2, marginBottom: 4
                                                                                }]}>{item.attachment}</Text>
                                                                            </TouchableOpacity>
                                                                            :
                                                                            <TouchableOpacity style={{backgroundColor:'red'}} onPress={() => {
                                                                                navigation.navigate('WebLoad', { linkname: Urls.imageUrl + item.attachment })
                                                                            }}>
                                                                                <Image
                                                                                    resizeMode='stretch'
                                                                                    style={{
                                                                                        justifyContent: 'center', alignSelf: 'center', marginBottom: 4,
                                                                                        width: 170, height: 120,
                                                                                    }}
                                                                                    source={{ uri: Urls.imageUrl + item.attachment }} />
                                                                            </TouchableOpacity>
                                                                        }
                                                                    </View>
                                                                    : null} */}
                                                        </View>

                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                                        {/* {item._from} TO {item._to} */}
                                                        {/* <View style={{ flexDirection: 'row', flex: 5 }}>
                                <Icon name={'ios-settings-sharp'} type={'ionicon'} size={30} color={Colors.TheamColor3} />
                                <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, textAlignVertical: 'center' }]}>{Moment(item._from).format('MMMM DD')}</Text>
                            </View> */}
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                navigation.navigate('Schedule1', { pr_id: item.activities[0].pk, 'item': item })
                                                            }}
                                                            style={{ flex: 1, height: 40, margin: 3, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: Colors.gray_d1 }}>
                                                            <Text style={[Style.text14, { textAlignVertical: 'center', textAlign: 'center', color: Colors.black }]}>View Details</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if (LocalData.FLAG == '1') {
                                                                    navigation.navigate('HomeOwnerReport', { pr_id: item.activities[0].property, 'item': item.activities[0], index: index })
                                                                }
                                                                else {
                                                                    navigation.navigate('HomeBuilderReport', { pr_id: item.activities[0].property, 'item': item.activities[0], index: index, milestoneArray: item.activities })
                                                                }
                                                            }}
                                                            style={{ flex: 1, height: 40, margin: 3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: Colors.TheamColor3 }}>
                                                            <Text style={[Style.text14, { textAlignVertical: 'center', textAlign: 'center', color: Colors.white }]}>View Milestones</Text>
                                                        </TouchableOpacity>


                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View>
                                        </View>
                                        //     )}
                                        //     keyExtractor={(item, index) => index.toString()}
                                        // // ListEmptyComponent={<NoData />}
                                        // />
                                        : null}
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<NoData itemtext="No activity" />}
                        />

                        {validationempty(linkname) ?
                            <WebView
                                source={{
                                    uri: linkname + ""
                                }}
                                style={{ height: 1, }}
                                startInLoadingState={true}
                                javaScriptEnabled={true}
                            /> : null}
                    </View>
            )
            }
        </SafeAreaView >
    );
};



export default Home;


