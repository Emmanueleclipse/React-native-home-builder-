import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    FlatList, 
    TouchableOpacity,
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
import Card from '../Compoment/Card';


const Home = ({ navigation, route }) => {
    const { pr_id, item , index} = route.params;
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])
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
            url = 'api/activity/approve/' + pk
        }
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                console.log("res", response);
                setLoding(false);
                showToast(JSON.stringify(response.data.detail) + "", "info")
                navigation.goBack();
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
            url = 'api/activity/decline/' + pk
        }
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                showToast(JSON.stringify(response.data.detail) + "", "info")
                navigation.goBack();
            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    let status = item.status

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

                    {   
                        validationempty(item) ?

                        <Card item={item} index={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[Style.buttonStyle22, { flex: 1, marginRight: 8, backgroundColor: status === 'completed' ? Colors.gray : Colors.TheamColor3 }]}>
                                    <TouchableOpacity
                                        disabled={status === 'completed' ? true : false}
                                        style={{ width: '100%' }}
                                        onPress={() => apiCall_approve(item.pk + "")}
                                    >
                                        <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>Approve</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[Style.buttonStyle22, { flex: 1, marginLeft: 8, backgroundColor: Colors.divider }]}>
                                    <TouchableOpacity
                                        disabled={status === 'completed' ? true : false}
                                        style={{ width: '100%' }}
                                        onPress={() => apiCall_delete(item.pk + "")}
                                    >
                                        <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.TheamColor4 }]}>Request Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                        :
                        <FlatList
                            style={{ marginTop: 6 }}
                            showsVerticalScrollIndicator={false}
                            data={userArray}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 10, flexDirection: 'column' }}>
                                    {   
                                        validationempty(item.activities) ?
                                        
                                        <FlatList
                                            style={{ flex: 1, width: '100%', }}
                                            showsVerticalScrollIndicator={false}
                                            data={item.activities}
                                            renderItem={({ item, index }) => (
                                                <Card item={item} index={index}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                         <View style={[Style.buttonStyle22, { flex: 1, marginRight: 8, backgroundColor: Colors.TheamColor4, borderWidth: 0, }]}>
                                                             <TouchableOpacity 
                                                                style={{ width: '100%' }}
                                                                onPress={() => apiCall_approve(item.pk + "")}
                                                            >
                                                                <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.white }]}>Approve</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={[Style.buttonStyle22, { flex: 1, marginLeft: 8, backgroundColor: Colors.divider }]}>
                                                            <TouchableOpacity
                                                                style={{ width: '100%' }}
                                                                onPress={() => apiCall_delete(item.pk + "")}
                                                            >
                                                                <Text style={[Style.text14, { textAlign: 'center', width: '100%', color: Colors.TheamColor4 }]}>Request Changes</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Card>
                                            )}
                                            ListEmptyComponent={<NoData />}
                                        />
                                        : null
                                    }
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </View >
            )
            }
        </SafeAreaView >
    );
};
export default Home;