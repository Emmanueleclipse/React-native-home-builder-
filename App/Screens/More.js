import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Image, Alert,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT } from '../Theme/Style';
import { ListItem, Icon } from 'react-native-elements'
import { Indicator, NoData, } from '../Common/CommonMethods';
import { LocalData } from '../Common/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({ navigation, route }) => {
    const [isLoding, setIsLoding] = useState(false);

    useEffect(() => {

    }, []);

    const logout = async () => {
        await AsyncStorage.setItem('access', '')
        await AsyncStorage.setItem('name', '')
        await AsyncStorage.setItem('email', '')
        await AsyncStorage.setItem('mobile', '')
        await AsyncStorage.setItem('role', '')
        await AsyncStorage.setItem('pk', '')

        navigation.replace('Splash')
    }
    return (
        <SafeAreaView style={Style.cointainer}>

            {isLoding ? (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column' }}>

                        <Text style={[Style.text16, { backgroundColor: Colors.divider, fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}></Text>



                        {LocalData.FLAG == '2' ?
                            <View>
                                <ListItem bottomDivider onPress={() => { navigation.navigate('CreateProperty1', {}) }} style={{ marginHorizontal: 15, }}>
                                    <Icon name={'home-city-outline'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>Create Property</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={30} />
                                </ListItem>

                                <ListItem bottomDivider onPress={() => { navigation.navigate('CreateProperty', {}) }} style={{ marginHorizontal: 15, }}>
                                    <Icon name={'tasklist'} type={'octicon'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>Create Milestone</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={30} />
                                </ListItem>

                                

                                <ListItem bottomDivider onPress={() => { navigation.navigate('PurchaseCredit', {}) }} style={{ marginHorizontal: 15, }}>
                                    <Icon name={'dollar-bill'} type={'foundation'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>Payment and Billing</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={30} />
                                </ListItem>



                            </View>
                            :
                            <View>
                                <ListItem bottomDivider onPress={() => { }} style={{ marginHorizontal: 15, }}>
                                    <Icon name={'image'} type={'entypo'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>Photos</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={30} />
                                </ListItem>

                                <ListItem bottomDivider onPress={() => { navigation.navigate('Crew', {}) }} style={{ marginHorizontal: 15, }}>
                                    <Icon name={'people-outline'} type={'ionicon'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>Crew</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron size={30} />
                                </ListItem>


                            </View>
                        }
                        <FlatList
                            style={{ paddingHorizontal: 15, flex: 1, width: '100%', marginTop: 6 }}
                            showsVerticalScrollIndicator={false}
                            data={Data}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <ListItem key={index} bottomDivider onPress={() => {
                                    if (item.name == 'Client') {
                                        navigation.navigate('Crew', {})
                                    }
                                    if (item.name == 'Manage Home') {
                                        navigation.navigate('ManageHome', {})
                                    }
                                    if (item.name == 'User Settings') {
                                        navigation.navigate('UserSetting', {})
                                    }
                                    if (item.name == 'Building Phases') {
                                        navigation.navigate('Buildphase')
                                    }
                                    // if (item.name == 'Manage Milestone') {
                                    //     if (LocalData.FLAG == '1') {
                                    //         navigation.navigate('HomeOwnerReport', { pr_id: '', 'item': '', index: '' })
                                    //     }
                                    //     else {
                                    //         navigation.navigate('HomeBuilderReport', { pr_id: '', 'item': '', index: '' })
                                    //     }
                                    // }
                                    if (item.name == 'Logout') {

                                        Alert.alert(
                                            "Logout",
                                            `Are you sure you want to Logout from Application?`,
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "OK", onPress: () => { logout(); } }
                                            ],
                                            { cancelable: true }
                                        );


                                    }

                                }}>

                                    <Icon name={item.iname} type={item.itype} color={item.name == 'Logout' ? 'red' : Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />

                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 14, fontFamily: CustomeFonts.Poppins_Regular }}>{item.name}</ListItem.Title>
                                    </ListItem.Content>
                                    {item.name == 'Logout' ? null
                                        :
                                        <ListItem.Chevron size={30} />
                                    }
                                </ListItem>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<NoData />}
                        />
                    </View>
                </ScrollView>
            )
            }
        </SafeAreaView >
    );
};

const Data = [

    // {
    //     iname: 'home-city-outline',
    //     itype: 'material-community',
    //     name: 'Create Property',

    // },
    // {
    //     iname: 'dollar-bill',
    //     itype: 'foundation',
    //     name: 'Upgrade',

    // },

    // {
    //     iname: 'image',
    //     itype: 'entypo',
    //     name: 'Photos',

    // },
    // {
    //     iname: 'bar-chart',
    //     itype: 'ionicon',
    //     name: 'Manage Milestone',

    // },
    // {
    //     iname: 'clipboard-notes',
    //     itype: 'foundation',
    //     name: 'Building Phases',

    // },
    // {
    //     iname: 'clipboard-notes',
    //     itype: 'foundation',
    //     name: 'Resources',

    // },
    // {
    //     iname: 'people-outline',
    //     itype: 'ionicon',
    //     name: 'Client',

    // },
    {
        iname: 'ios-home-outline',
        itype: 'ionicon',
        name: 'Manage Home',

    },
    {
        iname: 'Help',
        itype: 'material',
        name: 'Help and Resources',

    },
    {
        iname: 'ios-settings-sharp',
        itype: 'ionicon',
        name: 'User Settings',

    },

    // {
    //     iname: 'ios-search-sharp',
    //     itype: 'ionicon',
    //     name: 'Help Center',

    // },

    {
        iname: 'logout',
        itype: 'material-community',
        name: 'Logout',

    },

];

export default Home;


