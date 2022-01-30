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
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/Ionicons'
import moment from 'moment';


const Home = ({ navigation, route }) => {
    const { pr_id } = route.params;
    const [isLoding, setLoding] = useState(true);
    const [userArray, setuserArray] = useState([])
    const isFocused = useIsFocused()

    useEffect(() => {
        apiCall_proprtylist()
    }, [isFocused]);

    const apiCall_proprtylist = async () => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url;
        if (validationempty(pr_id)) {
            url = 'api/property/' + pr_id
        }
        else {
            url = 'api/property/'
        }
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                console.log("======response.data", JSON.stringify(response.data))
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

            <Text style={[Style.text16, { backgroundColor: Colors.divider, fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Notifications</Text>

            {isLoding ? (
                <View style={{ alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: 6 }}
                    showsVerticalScrollIndicator={false}
                    data={userArray}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{ paddingHorizontal: 15, flexDirection: 'column' }}>

                            {validationempty(item.activities) ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={item.activities}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            style={{ marginTop: 5, backgroundColor: 'white', elevation: 5, borderRadius: 10, marginVertical: 10, paddingLeft: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {/* <View style={{ backgroundColor: '#D3D3D3', borderColor: 'black', borderWidth: 1, alignItems: "center", justifyContent: "center", height: 70, width: 70, borderRadius: 100, margin: 5, marginRight: 10 }} > */}
                                                    {/* <Icon3 name={'notifications'} color={'black'} size={30} /> */}
                                                    {/* <View style={{zIndex:1,position: 'absolute',bottom:2,right:-3,justifyContent:'center',alignItems:"center"}} >
                                                        <Icon3 style={{zIndex:2,position:'absolute',bottom:2,right:3,}} name={'notifications'} color={'black'} size={20} />
                                                    </View> */}
                                                {/* </View> */}
                                                <View style={{ padding: 15, flexDirection: 'column', paddingHorizontal: 8 }}>
                                                    <Text style={[Style.text18, { fontFamily: CustomeFonts.Poppins_SemiBold }]}>{item.milestone_name}</Text>
                                                    <Text style={[Style.text14, { paddingVertical: 5, }]}>{item.description}</Text>
                                                    <Text style={[Style.text14, { paddingTop: 5, color: 'grey' }]}>{moment(item.created_at).format('DD MMM , yyyy')}</Text>
                                                </View>
                                            </View>
                                            {/* <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View> */}
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
            )
            }
        </SafeAreaView >
    );
};



export default Home;

