import React, { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
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

import Icon2 from 'react-native-vector-icons/FontAwesome'
import { TextInput } from 'react-native';
import Icon3 from 'react-native-vector-icons/Ionicons'
import moment from 'moment';



const ChatScreen = ({ navigation, route }) => {
    const [isLoding, setLoding] = useState(false);
    const [myemail, setmyemail] = useState('');
    const [messageArray, setmessageArray] = useState([])
    const [text, setText] = useState('')
    const flatList = React.createRef();
    const { item } = route.params;

    useEffect(async() => {
        var myemail = await AsyncStorage.getItem('email')
        setmyemail(myemail)
        getMessageList()
        console.log("items::: ", JSON.stringify(route.params.item))
    }, []);


    const apiCall_createmessage = async () => {

        var access = await AsyncStorage.getItem('access')
        var myemail = await AsyncStorage.getItem('email')
        
        setmyemail(myemail)
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };

        var formdata = new FormData();
        formdata.append('parent', item.pk);
        formdata.append('send_to', route.params.item.send_to==myemail?route.params.item.send_by:route.params.item.send_to);
        formdata.append('send_by', route.params.item.send_to==myemail?route.params.item.send_to:route.params.item.send_by);
        // formdata.append('subject', item.subject);
        formdata.append('message', text);
        // formdata.append('attachment', profileImage);
        // if (validationempty(pImage)) {
        //     formdata.append('attachment', profileImage);
        // }
        // else {
        // formdata.append('attachment', '');
        // }
        console.log(access);
        console.log(formdata);
        Axios.post(Urls.baseUrl + 'api/reply-message/', formdata, { headers })
            .then(response => {
                console.log("======", response)
                setLoding(false);
                if (validationempty(response.data)) {
                    showToast('Added Successfully', "success");
                    setText('')
                    getMessageList()
                }
            }).catch(function (error) {
                console.log("KKKLLLL K ", JSON.stringify(error.response))
                setLoding(false);
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
    const getMessageList = async () => {
        var access = await AsyncStorage.getItem('access')
        
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        

        console.log("======messages", Urls.baseUrl + 'api/messages/'+route.params.item.pk,headers)
        Axios.get(Urls.baseUrl + 'api/messages/'+route.params.item.pk, { headers })
            .then(response => {
                setLoding(false);
                console.log(response.data)
                if (response.data != null) {
                    setmessageArray(response.data.replies)
                }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(error.response.data + "", "error")
                }
            });

    };
    const sendButtonClick = () => {
        apiCall_createmessage();
    }
    
    return (
        <SafeAreaView style={Style.cointainer}>
            <View style={{ flex: 1 }} >



                <View style={{ flex: 1, padding: 15, flexDirection: 'column' }}>
                    <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>{item.subject}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                        
                            <FlatList
                                inverted
                                // bounces={false}
                                contentContainerStyle={{ flexDirection: 'column-reverse'}}
                                ref={flatList}
                                // initialScrollIndex={0}
                                style={styles.container}
                                // contentContainerStyle={styles.scrollContainer}
                                ListHeaderComponent={
                                    <View>
                                            
                                              
                                                    <View
                                            style={[styles.chatBubble,
                                            item.send_by === myemail ? styles.chatRightBubble : styles.chatLeftBubble,
                                            item.created_at ? { marginTop: 40 } : null,
                                            ]}>
                                            {item.created_at && (
                                                <View style={[styles.dateWrapper, item.send_by === myemail ? styles.datePosRight : styles.datePosLeft]}>
                                                    <Text style={styles.dateTxt}>{moment(item.created_at).format('DD MMM')}</Text>
                                                </View>
                                            )}

                                            <View style={[
                                                item.send_by === myemail ? styles.chatRightText : styles.chatLeftText]} >
                                                <Text style={[item.send_by === myemail? styles.chatRightText : styles.chatLeftText]} >{item.message}</Text>
                                            </View>
                                            <Text style={{ position: 'absolute', right: 15, bottom: 3, color: '#D4D5D7', fontSize: 12 }}>{moment.utc(item.created_at).local().format('hh:mm a')}</Text>
                                        </View>
                                        
                                                
                                            
                                            </View>
                                }
                                showsVerticalScrollIndicator={false}
                                onScrollToIndexFailed={info => {
                                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                                    wait.then(() => {
                                      flatList.current?.scrollToIndex({ index: info.index, animated: true });
                                    });
                                  }}
                                data={messageArray}
                                renderItem={({ item,index }) => {
                                    const hasDatePrint = typeof item.created_at === 'string';
                                    return (
                                       
                                        <View
                                            style={[styles.chatBubble,
                                            item.send_by === myemail ? styles.chatRightBubble : styles.chatLeftBubble,
                                            hasDatePrint ? { marginTop: 40 } : null,
                                            ]}>
                                            {hasDatePrint && (
                                                <View style={[styles.dateWrapper, item.send_by === myemail ? styles.datePosRight : styles.datePosLeft]}>
                                                    <Text style={styles.dateTxt}>{moment(item.created_at).format('DD MMM')}</Text>
                                                </View>
                                            )}

                                            <View style={[
                                                item.send_by === myemail ? styles.chatRightText : styles.chatLeftText]} >
                                                <Text style={[item.send_by === myemail? styles.chatRightText : styles.chatLeftText]} >{item.message}</Text>
                                            </View>
                                            <Text style={{ position: 'absolute', right: 15, bottom: 3, color: '#D4D5D7', fontSize: 12 }}>{moment.utc(item.created_at).local().format('hh:mm a')}</Text>
                                        </View>
                                       
                                    )
                                }
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <View style={{
                                padding: 10,
                                backgroundColor: '#f0f3f7',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                marginBottom: 5
                            }}>
                                <TextInput
                                    value={text}
                                    mode="outlined"
                                    placeholder="Message"
                                    style={{
                                        flex: 1,
                                        marginRight: 10,
                                        marginLeft: 10,
                                        maxHeight: 50
                                    }}
                                    onChangeText={(t) => setText(t)}
                                    theme={{ roundness: 10 }}
                                    outlineColor="#D8D8DC"

                                    multiline
                                    dense
                                />
                                <View />
                                {/* {text.length > 0 ? ( */}
                                <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }} onPress={() => sendButtonClick()} >
                                    <Icon2 name={'send'} color={'black'} size={24} />
                                </TouchableOpacity>
                                {/* ) : null}    */}
                            </View>
                            {
                                isLoding ?
                                    <View style={{ position: 'absolute', zIndex: 10, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', }}>
                                        <Indicator></Indicator>
                                    </View>
                                    : null
                            }
                        </KeyboardAvoidingView>

                    </View>

                </View>

            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    chatLeftBubble: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        // marginBottom:25,
        backgroundColor: '#ffffff',
    },
    chatRightBubble: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        alignSelf: 'flex-end',
        backgroundColor: Colors.TheamColor2,
    },
    container: {
        backgroundColor: '#F7F9FE',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    chatBubble: {
        padding: 10,
        paddingBottom: 25,
        marginBottom: 10,
        flexDirection: 'row',
        width: 280,
        marginVertical: 10,
    },
    dateWrapper: {
        width: 100,
        height: 20,
        backgroundColor: 'rgba(189, 195, 199,0.3)',
        borderRadius: 15,
        position: 'absolute',
        top: -35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    datePosLeft: {
        left: '45%',
    },
    datePosRight: {
        right: '40%',
    },
    dateTxt: {
        color: 'rgba(44, 62, 80,1.0)',
        fontWeight: '500',
        fontSize: 11,
    },
    chatLeftText: {
        color: '#000',
        fontSize: 17,
    },
    chatRightText: {
        color: '#FFFFFF',
        fontSize: 17,
    },
})
export default ChatScreen;


