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
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Icon1 from 'react-native-vector-icons/Ionicons'
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { ListItem, Icon } from 'react-native-elements'
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'



const Home = ({ navigation, route }) => {
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState([])

    useEffect(() => {
        apiCall_proprtylist()
    }, []);

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
                console.log("======property", response.data)
                if (response.data != null) { setuserArray(response.data) }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };

    const apiCall_Delete = async (pkk) => {
        var access = await AsyncStorage.getItem('access')
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        Axios.delete(Urls.baseUrl + 'api/property/' + pkk, { headers })
            .then(response => {
                console.log("======delete", response)
                setLoding(false);
                // if (validationempty(response.data)) {
                showToast('Delete Successfully', "success");
                navigation.popToTop();
                // }
            }).catch(function (error) {
                setLoding(false);
                console.log("======", error.response)
                if (error.response) {
                    showToast(JSON.stringify(error.response.data )+ "", "error")
                }

            });

    };

    const showAlert2 = async (ss) => {
        Alert.alert(
            "Delete Property",
            `Are you sure you want to delete Property ?`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => { apiCall_Delete(ss + "") } }
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
                <View style={{ flex: 1, padding: 15, flexDirection: 'column' }}>


                    <TouchableOpacity style={{
                        marginBottom: 20,
                        justifyContent: 'flex-start', alignItems: 'flex-start'
                    }}>
                        <Icon1 name={'arrow-back-outline'} type={'ionicon'} size={30}
                            onPress={() => { navigation.goBack() }} />
                    </TouchableOpacity>

                    <Text style={[Style.text22, { fontSize: 25, lineHeight: 30, marginBottom: 30, fontFamily: CustomeFonts.Poppins_Regular, justifyContent: 'center', textAlign: 'center', }]}>Manage
                        <Text style={[Style.text22, { fontSize: 25, lineHeight: 30, fontFamily: CustomeFonts.Poppins_Bold, color: Colors.black }]}> Home</Text>
                    </Text>


                    <FlatList
                        style={{ flex: 1, width: '100%', marginTop: 6, paddingBottom: 60 }}
                        showsVerticalScrollIndicator={false}
                        data={userArray}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={{
                                    marginBottom: 10, borderRadius: 2,
                                    backgroundColor: '#e8f6fb',
                                    flex: 1, borderBottomWidth: 1, borderColor: Colors.divider,
                                    flexDirection: 'row', padding: 10
                                }}>
                                <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, color: Colors.TheamColor2, flex: 2, textAlignVertical: 'center' }]}>{item.name}</Text>

                                {LocalData.FLAG == '2'
                                    ?
                                    <Menu>
                                        <MenuTrigger >
                                            <Icon
                                                type='material-community' name="lead-pencil" size={18} color={Colors.white} style={{ color: Colors.white, padding: 10, borderRadius: 4, backgroundColor: Colors.TheamColor2 }} />
                                        </MenuTrigger>
                                        <MenuOptions style={{ padding: 8, }} optionsContainerStyle={{ marginTop: 45 }}>

                                            <MenuOption value={1}
                                                onSelect={() => {
                                                    Alert.alert(
                                                        "Edit Property",
                                                        `Are you sure you want to Edit Property ?`,
                                                        [
                                                            {
                                                                text: "Cancel",
                                                                onPress: () => console.log("Cancel Pressed"),
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "OK", onPress: () => {
                                                                    navigation.navigate('EditProprty', { pk: item.pk, data: item })
                                                                }
                                                            }
                                                        ],
                                                        { cancelable: true }
                                                    );
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Icon name={'edit'} type={'font-awesome'} size={20} style={{ width: 25 }} color={Colors.lightblack} />
                                                    <Text style={[Style.text16, { justifyContent: 'center', textAlignVertical: 'center', paddingLeft: 10 }]}>Edit Property</Text>
                                                </View>
                                            </MenuOption>

                                            <MenuOption value={11} style={{ marginTop: 6 }}
                                                onSelect={() => {
                                                    showAlert2(item.pk);
                                                }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Icon name={'trash-o'} type={'font-awesome'} size={20} style={{ width: 25 }} color={Colors.lightblack} />
                                                    <Text style={[Style.text16, { justifyContent: 'center', textAlignVertical: 'center', paddingLeft: 10 }]}>Delete Property</Text>
                                                </View>
                                            </MenuOption>

                                            <MenuOption value={2} style={{ marginTop: 6 }} onSelect={() => { navigation.navigate('Crewdetail', { pk: item.pk, name: item.name }) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Icon name={'anchor'} type={'font-awesome'} size={20} style={{ width: 25 }} color={Colors.lightblack}
                                                    />
                                                    <Text style={[Style.text16, { justifyContent: 'center', textAlignVertical: 'center', paddingLeft: 10 }]}>Manage Crew</Text>
                                                </View>
                                            </MenuOption>

                                        </MenuOptions>
                                    </Menu> :


                                    <Menu>
                                        <MenuTrigger
                                            onPress={() => {
                                                navigation.navigate('ScheduleHome', { pr_id: item.pk})
                                            }}>
                                            <Icon
                                                type='material-community' name="calendar" size={18} color={Colors.white} style={{ color: Colors.white, padding: 10, borderRadius: 4, backgroundColor: Colors.TheamColor2 }} />
                                        </MenuTrigger>
                                    </Menu>}

                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<NoData />}
                    />
                </View>
                // </ScrollView>
            )
            }
        </SafeAreaView >
    );
};



export default Home;


