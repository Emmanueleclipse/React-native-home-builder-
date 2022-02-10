import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet, Alert,
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
import { useIsFocused } from '@react-navigation/native'
import Moment from 'moment';

const Home = ({ navigation, route }) => {

    const { pr_id, item, index, milestoneArray } = route.params;
    const [isLoding, setLoding] = useState(false);
    const [loding, setLoding1] = useState(false);
    const [loding1, setLoding11] = useState(false);
    const [userArray, setuserArray] = useState()
    const isFocused = useIsFocused()

    useEffect(() => {
        if (validationempty(item)) {

        }
        else {
            apiCall_proprtylist()
        }

    }, [isFocused]);

    const apiCall_proprtylist = async () => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url = 'api/property/'
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                if (response.data != null) { setuserArray(response.data) }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    const apiCall_approve = async (pk) => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url;
        if (validationempty(pk)) {
            url = 'api/activity/submit/' + pk
        }
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                showToast(response.data.detail + "", "info")
                // navigation.goBack();
            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    const apiCall_delete = async (pk) => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url;
        if (validationempty(pk)) {
            url = 'api/activity/' + pk
        }
        Axios.delete(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                navigation.goBack();
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
                <View style={{ flex: 1, paddingHorizontal: 15, flexDirection: 'column' }}>

                    <View style={[{ width: '50%', marginTop: 20, justifyContent: 'center', alignSelf: 'center' }]}>
                        <TouchableOpacity
                            style={{ width: '100%', alignItems: "center" }}
                            onPress={() => {
                                navigation.navigate('MessagesProperty', { pr_id: pr_id })
                            }}
                        >
                            <Icon name={'message-bulleted'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />

                            <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.TheamColor3 }]}>Messages</Text>
                        </TouchableOpacity>
                    </View>
                    {validationempty(item) ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={milestoneArray}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        flex: 1, borderBottomWidth: 1, borderColor: Colors.divider,
                                        flexDirection: 'column', paddingVertical: 10, marginTop: 20, backgroundColor: Colors.TheamColor, elevation: 5, margin: 5, paddingVertical: 15, padding: 10, borderRadius: 10
                                    }}>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Text style={[Style.text14, { flex: 1 }]}>{(index + 1)}.  {item.milestone_name}</Text>
                                    </View>

                                    {item.status == 'approved' ?
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[Style.text14, {
                                                flexShrink: 1, padding: 4, borderColor: Colors.gray_d1, borderWidth: 1, borderRadius: 8, color: Colors.TheamColor4, marginTop: 8
                                            }]}>{item.status}</Text>
                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[Style.text14, {
                                                flexShrink: 1, padding: 4, borderColor: Colors.gray_d1, borderWidth: 1, borderRadius: 8, color: '#FB0015', marginTop: 8
                                            }]}>{item.status}</Text>

                                        </View>
                                    }


                                    <Text style={[Style.text14, { marginTop: 8 }]}>Due {Moment(item._to).format('MMMM DD, YYYY')}</Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        {/* {item.status == 'approved' ? null : */}
                                        <View style={[{ flex: 1, height: 40, marginVertical: 3, marginTop: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: item.status == 'approved' ? Colors.gray : Colors.TheamColor3 }]}>
                                            {
                                                item.status == 'approved' ?
                                                    <View
                                                        style={{ width: '100%' }}

                                                    >
                                                        <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>{item.status == 'approved' ? '' : 'Submit'}</Text>
                                                    </View>


                                                    :
                                                    <TouchableOpacity
                                                        style={{ width: '100%' }}
                                                        onPress={() => {
                                                            if (item.status == 'approved') { }
                                                            else {
                                                                Alert.alert(
                                                                    "Submit",
                                                                    `Are you sure you want to Submit ?`,
                                                                    [
                                                                        {
                                                                            text: "Cancel",
                                                                            onPress: () => console.log("Cancel Pressed"),
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "OK", onPress: () => {
                                                                                apiCall_approve(item.pk + "")
                                                                            }
                                                                        }
                                                                    ],
                                                                    { cancelable: true }
                                                                );
                                                            }

                                                        }}
                                                    >
                                                <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>{item.status == 'approved' ? '' : 'Submit'}</Text>
                                                    </TouchableOpacity>


                                            }

                                        </View>
                                    </View>
                                </View>
                            )}

                            keyExtractor={(item, index) => index.toString()}
                        />


                        :
                        <FlatList
                            style={{ marginTop: 6 }}
                            showsVerticalScrollIndicator={false}
                            data={userArray}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 10, flexDirection: 'column' }}>

                                    {validationempty(item.activities) ?
                                        <FlatList
                                            style={{ flex: 1, width: '100%', }}
                                            showsVerticalScrollIndicator={false}
                                            data={item.activities}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1, borderBottomWidth: 1, borderColor: Colors.divider,
                                                        flexDirection: 'column', paddingVertical: 10,
                                                    }}>
                                                    <Text style={[Style.text14, {}]}>{(index + 1)}  {item.milestone_name}</Text>

                                                    {item.status == 'approved' ?
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <Text style={[Style.text14, {
                                                                flexShrink: 1, padding: 4, borderColor: Colors.gray_d1, borderWidth: 1, borderRadius: 8, color: Colors.TheamColor4, marginTop: 8
                                                            }]}>{item.status}</Text>
                                                        </View>
                                                        :
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <Text style={[Style.text14, {
                                                                flexShrink: 1, padding: 4, borderColor: Colors.gray_d1, borderWidth: 1, borderRadius: 8, color: '#FB0015', marginTop: 8
                                                            }]}>{item.status}</Text>

                                                        </View>
                                                    }


                                                    <Text style={[Style.text14, { marginTop: 8 }]}>Due {Moment(item._to).format('MMMM DD, YYYY')}</Text>

                                                    <View style={{ flexDirection: 'row' }}>
                                                        {/* {item.status == 'approved' ? null : */}
                                                        <View style={[Style.buttonStyle22, { flex: 1, marginRight: 8, backgroundColor: Colors.TheamColor4, borderWidth: 0, }]}>
                                                            <TouchableOpacity
                                                                style={{ width: '100%' }}
                                                                onPress={() => {
                                                                    if (item.status == 'approved') { }
                                                                    else {
                                                                        Alert.alert(
                                                                            "Submit",
                                                                            `Are you sure you want to Submit ?`,
                                                                            [
                                                                                {
                                                                                    text: "Cancel",
                                                                                    onPress: () => console.log("Cancel Pressed"),
                                                                                    style: "cancel"
                                                                                },
                                                                                {
                                                                                    text: "OK", onPress: () => {
                                                                                        apiCall_approve(item.pk + "")
                                                                                    }
                                                                                }
                                                                            ],
                                                                            { cancelable: true }
                                                                        );
                                                                    }

                                                                }}
                                                            >
                                                                <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>{item.status == 'approved' ? '' : 'Submit'}</Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                        {/* } */}
                                                        {/* <View style={[Style.buttonStyle2, { flex: 1, marginRight: 8, backgroundColor: Colors.white, borderColor: '#CD1A1D', borderWidth: 2, }]}>
                                                        <TouchableOpacity
                                                            style={{ width: '100%' }}
                                                            onPress={() => {
                                                                Alert.alert(
                                                                    "Delete",
                                                                    `Are you sure you want to Delete ?`,
                                                                    [
                                                                        {
                                                                            text: "Cancel",
                                                                            onPress: () => console.log("Cancel Pressed"),
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "OK", onPress: () => {
                                                                                apiCall_delete(item.pk + "")
                                                                            }
                                                                        }
                                                                    ],
                                                                    { cancelable: true }
                                                                );
                    
                                                            }}
                                                        >
                                                            <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.lightblack }]}>Delete</Text>
                                                        </TouchableOpacity>
                    
                                                    </View> */}

                                                    </View>

                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListEmptyComponent={<NoData />}
                                        />
                                        : null}


                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}

                        />

                    }


                    {/* <Text style={[Style.text14]}>Due {Moment(item._to).format('MMMM DD, YYYY')}</Text> */}



                </View>
                // </ScrollView>
            )
            }
        </SafeAreaView >
    );
};


export default Home;

