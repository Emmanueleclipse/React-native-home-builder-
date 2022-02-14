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
import { Icon } from 'react-native-elements';
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import { WebView } from 'react-native-webview';
import Moment from 'moment';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import { useIsFocused } from '@react-navigation/native'



const Home = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])
    const [linkname, setlinkname] = useState('')
    const [myemail, setmyemail] = useState('');
    useEffect(async() => {
        setlinkname('')
        apiCall_messages()
        var myemail = await AsyncStorage.getItem('email')
        setmyemail(myemail)
    }, [isFocused]);

    useEffect(() => { }, [linkname]);


    const apiCall_messages = async () => {
        var access = await AsyncStorage.getItem('access')
        var pk = await AsyncStorage.getItem('pk')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        console.log("======messages", Urls.baseUrl + 'api/messages/')
        Axios.get(Urls.baseUrl + 'api/messages/', { headers })
            .then(response => {
                setLoding(false);
                console.log("======messages data", response.data)
                if (response.data != null) { setuserArray(response.data) }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(error.response.data.detail + "", "error")
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
                <View style={{ flex: 1, padding: 15, flexDirection: 'column' }}>
                    <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Messages</Text>

                    <View style={{ marginBottom: 15, flexDirection: 'row', width: '100%' }}>
                        <Text style={[Style.text22, { textAlignVertical: 'center', flex: 7 }]}>Inbox</Text>
                        <View style={[Style.buttonStyle2, { flex: 4 }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('NewMessage', {})
                                }}
                                style={{ width: '100%' }}>
                                <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Compose</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    {/* <TouchableOpacity
                        style={{
                            borderRadius: 8,
                            flexDirection: 'row', paddingVertical: 10, backgroundColor: Colors.TheamColor2
                        }}>
                        <Text style={[Style.text16, { marginLeft: 4, color: Colors.white, flex: 1 }]}>Time</Text>
                        <Text style={[Style.text16, { marginHorizontal: 4, color: Colors.white, flex: 1 }]}>From</Text>
                        <Text style={[Style.text16, { flex: 1.5, color: Colors.white, }]}>Subject</Text>

                    </TouchableOpacity> */}
                    <View style={{ flexDirection: 'column', flex: 1 }}>

                        <FlatList
                            style={{ width: '100%', marginTop: 6 }}
                            showsVerticalScrollIndicator={false}
                            data={userArray}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        flex: 1, 
                                        flexDirection: 'row', paddingVertical: 10,borderBottomWidth:1, borderBottomColor:'lightgrey',borderRadius:10
                                    }}
                                    onPress={()=>{navigation.navigate('ChatScreen',{item:item})}}>
                                    <View style={{ height: 50,justifyContent:'center',alignItems:'center', width: 50,marginLeft:10, backgroundColor: 'lightgrey', borderRadius: 100, borderColor: 'black' }} >
                                    <Text style={[Style.text18, { color: Colors.TheamColor2 }]}>{item.subject[0]}</Text>

                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal:10 ,marginHorizontal:8 }} >
                                        <View style={{ flexDirection: 'row',}} >
                                            <Text style={[Style.text18, { flex: 1, color: Colors.TheamColor2 }]} numberOfLines={2}>{item.subject}</Text>
                                            <Text style={[Style.text14]}>{Moment(item.created_at).format('yyyy-MM-DD ')}</Text>
                                        </View>
                                        <Text style={[Style.text16, {paddingTop:10, flex: 1 }]}>{item.send_to==myemail?item.send_by:item.send_to}</Text>
                                    </View>

                                    {/* {validationempty(item.attachment) ? <Icon type='entypo' name="attachment" size={15}
                                        onPress={() => {
                                            {
                                                (item.attachment).endsWith('.doc') ||
                                                    (item.attachment).endsWith('.docx') ||
                                                    (item.attachment).endsWith('.pdf') ?
                                                    setlinkname(Urls.imageUrl + item.attachment)
                                                    :
                                                    navigation.navigate('WebLoad', { linkname: Urls.imageUrl + item.attachment })
                                            }
                                        }} /> : <View style={{ width: 15 }} />} */}

                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<NoData itemtext="No message" />}
                        />
                        <View style={{ height: 0, backgroundColor: Colors.white }}>
                            {validationempty(linkname) ?
                                <WebView
                                    source={{
                                        uri: linkname + ""
                                    }}
                                    style={{ height: 0, position: 'absolute' }}
                                    startInLoadingState={true}
                                    javaScriptEnabled={true}
                                /> : null}</View>
                    </View>

                </View>
            )
            }
        </SafeAreaView >
    );
};


export default Home;

