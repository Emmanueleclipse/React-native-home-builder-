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
        var url = 'api/property/' + pr_id;

        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                console.log("======response.data", response.data.activities)
                if (response.data != null) { setuserArray(response.data.activities) }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(error.response.data + "", "error")
                }
            });

    };

    return (
        <SafeAreaView style={Style.cointainer}>

            <Text style={[Style.text16, { backgroundColor: Colors.divider, fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Schedule</Text>

            {isLoding ? (
                <View style={{ alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                // <FlatList
                //     style={{ marginTop: 6 }}
                //     showsVerticalScrollIndicator={false}
                //     data={userArray}
                //     renderItem={({ item, index }) => (
                //         <TouchableOpacity
                //             style={{ paddingHorizontal: 15, flexDirection: 'column' }}>

                //             {validationempty(item.activities) ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={userArray}
                    renderItem={({ item, index }) => (

                        <TouchableOpacity
                            style={{ marginTop: 5, paddingHorizontal: 5, }}>
                            <View style={{ flexDirection: 'row', paddingVertical: 6 }}>

                                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', paddingHorizontal: 8 }}>
                                    <Text style={[Style.text16, { flex: 2, fontFamily: CustomeFonts.Poppins_SemiBold }]}>{(index+1)}. {item.milestone_name}</Text>
                                    <Text style={[Style.text12, { flex: 2, marginTop: 4 }]}>{item.description}</Text>
                                    <Text style={[Style.text12, { flex: 2, marginTop: 4 }]}>{item._from} TO {item._to}</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                // ListEmptyComponent={<NoData />}
                />
                //                 : null}


                //         </TouchableOpacity>
                //     )}
                //     keyExtractor={(item, index) => index.toString()}
                //     ListEmptyComponent={<NoData itemtext="No activity" />}
                // />
            )
            }
        </SafeAreaView >
    );
};



export default Home;


