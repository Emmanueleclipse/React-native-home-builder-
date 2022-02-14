import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Colors from '../Theme/Colors';
import Style from '../Theme/Style';
import { Icon } from 'react-native-elements';
import { validationempty } from '../Common/Validations';
import { Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'
import { useIsFocused } from '@react-navigation/native'
import Moment from 'moment';
import Card from '../Compoment/Card';

const Home = ({ navigation, route }) => {

    const { pr_id, item, index, milestoneArray } = route.params;
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState()
    const isFocused = useIsFocused()

    useEffect(() => {
        apiCall_proprtylist();

    }, [isFocused]);

    const apiCall_proprtylist = async () => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url = 'api/property/' + pr_id
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
                apiCall_proprtylist();
                showToast(response.data.detail + "", "info")
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

    const showAlert = item => {
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
                        if (item.status === 'Awaiting feedback') {
                            return showToast("Awaiting feedback", "error")
                        } else {
                            apiCall_approve(item.pk + "")
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    }

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
                            onPress={() => navigation.navigate('MessagesProperty', { pr_id: pr_id })}
                        >
                            <Icon name={'message-bulleted'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                            <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.TheamColor3 }]}>Messages</Text>
                        </TouchableOpacity>
                    </View>
                    {validationempty(userArray?.activities) ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={userArray?.activities}
                            renderItem={({ item, index }) => (
                                <Card item={item} index={index}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[{ flex: 1, height: 40, marginVertical: 3, marginTop: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 4, backgroundColor: item.submitted && item.status !== 'ongoing' ? Colors.gray : item.status === 'completed' ? Colors.gray : Colors.TheamColor3 }]}>
                                            {
                                                item.status == 'approved' ?
                                                    <View style={{ width: '100%' }}>
                                                        <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>Submit</Text>
                                                    </View>
                                                    :
                                                    <TouchableOpacity
                                                        disabled={item.submitted && item.status !== 'ongoing'}
                                                        style={{ width: '100%' }}
                                                        onPress={() => showAlert(item)}
                                                    >
                                                        <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: item.submitted && item.status !== 'ongoing' ? Colors.gray : item.status === 'completed' ? Colors.gray : Colors.white }]}>{item.status == 'approved' ? '' : 'Submit'}</Text>
                                                    </TouchableOpacity>
                                            }

                                        </View>
                                    </View>
                                </Card>
                            )}
                        />
                        : null}



                    {/* <Text style={[Style.text14]}>Due {Moment(item._to).format('MMMM DD, YYYY')}</Text> */}



                </View>
                // </ScrollView>
            )
            }
        </SafeAreaView >
    );
};


export default Home;

