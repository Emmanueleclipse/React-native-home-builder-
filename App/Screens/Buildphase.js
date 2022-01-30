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
import Icon1 from 'react-native-vector-icons/Ionicons'


const Home = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])
    const [linkname, setlinkname] = useState('')

    useEffect(() => {
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
                console.log("===", response)
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

            <TouchableOpacity style={{
                height: 56, marginLeft: 20,
                justifyContent: 'center', alignItems: 'flex-start'
            }}>
                <Icon1 name={'arrow-back-outline'} type={'ionicon'} size={30}
                    onPress={() => { navigation.goBack() }} />
            </TouchableOpacity>
            {isLoding ? (
                <View style={{ alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <FlatList
                        style={{ marginTop: 6 }}
                        showsVerticalScrollIndicator={false}
                        data={userArray}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: 'column' }}>
                                {validationempty(item.activities) ?
                                    <View>
                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                            <Image
                                                resizeMode='stretch'
                                                style={{
                                                    justifyContent: 'center', alignSelf: 'center', marginBottom: 4,
                                                    width: 50, height: 50, marginRight: 10
                                                }}
                                                source={
                                                    validationempty(item.image) ?
                                                        { uri: Urls.imageUrl + item.image }
                                                        : require('../../assets/logo.png')} />


                                            <Text style={[Style.text16, {
                                                justifyContent: 'center', textAlignVertical: 'center', fontFamily: CustomeFonts.Poppins_Bold
                                            }]}>{item.name}</Text>
                                        </View>
                                        <View style={{ marginTop: 10, height: 3, width: '100%', backgroundColor: Colors.divider }}></View>

                                    </View>
                                    : null}

                                {validationempty(item.activities) ?
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={item.activities}
                                        renderItem={({ item, index }) => (

                                            <TouchableOpacity
                                                style={{ marginTop: 5, paddingHorizontal: 4 }}>
                                                <View style={{ flexDirection: 'row', paddingVertical: 6 }}>

                                                    <View style={{
                                                        flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column'
                                                    }}>

                                                        <View style={{ flexDirection: 'row', }}>
                                                            {/* {item._from} TO {item._to} */}
                                                            <View style={{ flexDirection: 'row', flex: 5 }}>
                                                                <Icon name={'ios-settings-sharp'} type={'ionicon'} size={30} color={Colors.TheamColor3} />
                                                                <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, flex: 1, textAlignVertical: 'center' }]}>{Moment(item._from).format('MMMM DD')}</Text>
                                                            </View>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    if (LocalData.FLAG == '1') {
                                                                        navigation.navigate('HomeOwnerReport', { pr_id: item.property, 'item': item , index: index })
                                                                    }
                                                                    else {
                                                                        navigation.navigate('HomeBuilderReport', { pr_id: item.property, 'item': item, index: index  })
                                                                    }
                                                                }}
                                                                style={{ flex: 2.5, marginRight: 8, height: 40, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: Colors.TheamColor3 }}>
                                                                <Text style={[Style.text14, { textAlignVertical: 'center', textAlign: 'center', color: Colors.white }]}>Reports</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    navigation.navigate('Schedule1', { pr_id: item.pk, 'item': item })
                                                                }}
                                                                style={{ flex: 2.5, height: 40, marginLeft: 8, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: Colors.TheamColor3 }}>
                                                                <Text style={[Style.text14, { textAlignVertical: 'center', textAlign: 'center', color: Colors.white }]}>Schedule</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginTop: 10, }}>
                                                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                                                <Text style={[Style.text16, { flex: 2, fontFamily: CustomeFonts.Poppins_Bold }]}>{item.milestone_name}</Text>
                                                                <Text style={[Style.text12, { flex: 2, marginTop: 4, color: Colors.gray }]}>{item.description}</Text>
                                                            </View>
                                                            <Text style={[Style.text12, { marginTop: 4, color: Colors.TheamColor2, textAlign: 'right', justifyContent: 'flex-end', textAlignVertical: 'top', }]}>{item.status}</Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                            <View style={{ flex: 3.5 }}>
                                                                {validationempty(item.attachment) ?
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
                                                                            <TouchableOpacity onPress={() => {
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
                                                                    : null}
                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    // ListEmptyComponent={<NoData />}
                                    />
                                    : null}
                            </TouchableOpacity>
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


