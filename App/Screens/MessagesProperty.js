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
import { useIsFocused } from '@react-navigation/native'

const Home = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const { pr_id } = route.params;
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])
    const [linkname, setlinkname] = useState('')

    useEffect(() => {
        setlinkname('')
        apiCall_messages()
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
        var url;
        if (validationempty(pr_id)) {
            url = 'api/messages/?property=' + pr_id
        }
        else {
            url = 'api/messages/'
        }
        console.log(url)
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                // console.log("======messages" + pr_id, response.data)
                if (response.data != null) { setuserArray(response.data) }

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
                <View style={{ flex: 1, padding: 15, flexDirection: 'column' }}>
                    <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Messages</Text>

                    <View style={{ marginBottom: 15, flexDirection: 'row', width: '100%' }}>
                        <Text style={[Style.text22, { textAlignVertical: 'center', flex: 7 }]}>Messages</Text>
                        <View style={[Style.buttonStyle2, { flex: 4 }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('NewMessageProperty', { pr_id: pr_id })
                                }}
                                style={{ width: '100%' }}>
                                <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Compose</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <TouchableOpacity
                        style={{
                            borderRadius: 8,
                            flexDirection: 'row', paddingVertical: 10, backgroundColor: Colors.TheamColor2
                        }}>
                        <Text style={[Style.text16, { marginLeft: 4, color: Colors.white, flex: 1 }]}>Time</Text>
                        <Text style={[Style.text16, { marginHorizontal: 4, color: Colors.white, flex: 1 }]}>From</Text>
                        <Text style={[Style.text16, { flex: 1.5, color: Colors.white, }]}>Subject</Text>

                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column', flex: 1 }}>

                        <FlatList
                            style={{ width: '100%', marginTop: 6 }}
                            showsVerticalScrollIndicator={false}
                            data={userArray}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={{
                                        justifyContent: 'center', alignItems: 'center',
                                        flex: 1, borderBottomWidth: 1, borderColor: Colors.divider,
                                        flexDirection: 'row', paddingVertical: 10
                                    }}>
                                    <Text style={[Style.text14, { flex: 1 }]}>{item.created_at}</Text>
                                    <Text style={[Style.text14, { marginHorizontal: 6, flex: 1 }]}>{item.send_by}</Text>
                                    <Text style={[Style.text14, { color: Colors.TheamColor2, flex: 1.5 }]}>{item.subject}</Text>

                                    {validationempty(item.attachment) ? <Icon type='entypo' name="attachment" size={15}
                                        onPress={() => {
                                            console.log(Urls.imageUrl + item.attachment)

                                            {
                                                (item.attachment).endsWith('.doc') ||
                                                    (item.attachment).endsWith('.docx') ||
                                                    (item.attachment).endsWith('.pdf') ?
                                                    setlinkname(Urls.imageUrl + item.attachment)
                                                    :
                                                    navigation.navigate('WebLoad', { linkname: Urls.imageUrl + item.attachment })
                                            }
                                        }} /> : <View style={{ width: 15 }} />}

                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<NoData itemtext="No message" />}
                        />

                    </View>
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
            )
            }
        </SafeAreaView >
    );
};


export default Home;


