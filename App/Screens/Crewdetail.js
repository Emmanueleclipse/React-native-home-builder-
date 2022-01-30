import React, { useEffect, useState } from 'react';
import {
    Modal, Picker,
    SafeAreaView,
    Text, ScrollView,
    View,
    Image,
    FlatList, Platform,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ToastAndroid,
} from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style, { HEIGHT } from '../Theme/Style';
import { ListItem, Icon } from 'react-native-elements'
import TextInput from "../Compoment/TextInput";
import {
    validatePhone, validateEmail, validateName, matchPassword,
    validationempty, validationBlank, validatePassword
} from '../Common/Validations';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Indicator, showToast, NoData } from '../Common/CommonMethods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios'


const Home = ({ navigation, route }) => {
    const { pk, name } = route.params;

    const [isLoding, setLoding] = useState(false);
    const [iisLoding, isetLoding] = useState(false);
    const [infoclick, setinfoclick] = useState(false);
    const [email, setEmail] = useState("");
    const [userArray, setuserArray] = useState([])
    const [crewarray, setcrewarray] = useState([])
    const [selectedValue, setSelectedValue] = useState(pk);
    const [selectedValue1, setSelectedValue1] = useState(pk);
    const [selectedValue1name, setselectedValue1name] = useState(name);

    useEffect(() => {
        apiCall()
    }, [selectedValue1]);

    useEffect(() => {
        // apiCall_proprtylist()
    }, []);

    const apiCall = async () => {
        if (validationempty(selectedValue1)) {
            setcrewarray([])
            var access = await AsyncStorage.getItem('access')
            var pk = await AsyncStorage.getItem('pk')
            setLoding(true);

            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": "application/json"
            };
            Axios.get(Urls.baseUrl + 'api/crew/?property=' + selectedValue1, { headers })
                .then(response => {
                    console.log("crew======", response)
                    setLoding(false);
                    setcrewarray(response.data)
                }).catch(function (error) {
                    setLoding(false);
                    if (error.response) {
                        showToast(JSON.stringify(error.response.data) + "", "error")
                    }

                });
        }


    };

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

                var cars = response.data;
                const newCar = {
                    pk: '',
                    name: 'Select Property'
                }
                const updatedCarsArray2 = [...cars, newCar].sort(function (a, b) { return a.pk - b.pk });
                setuserArray(updatedCarsArray2)
                setSelectedValue(updatedCarsArray2[0].pk)
                setSelectedValue1(updatedCarsArray2[0].pk)
                setselectedValue1name('')

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }

            });

    };

    const apiCall_Invite = async () => {

        if (
            validationBlank(selectedValue, "Select Property") &&
            validationBlank(email, "Enter Email")
        ) {

            var access = await AsyncStorage.getItem('access')
            isetLoding(true);

            const headers = {
                'Authorization': 'Bearer ' + access,
                "content-type": "application/json"
            };

            var params = JSON.stringify({
                property: selectedValue,
                receiver: email,
                invitation_type: 'crew'
            });

            console.log(access);
            console.log(params);
            Axios.post(Urls.baseUrl + 'api/invite-send/', params, { headers })
                .then(response => {
                    console.log("======", response)
                    isetLoding(false);
                    if (validationempty(response.data)) {

                        showToast('Invitation sent successfully !', "success");
                        setinfoclick(false);
                        // navigation.navigate('CreateProperty', {})
                    }
                }).catch(function (error) {
                    console.log("======error", error)
                    isetLoding(false);
                    if (error.response) {
                        showToast(JSON.stringify(error.response.data) + "", "error")
                    }

                });
        }

    }

    let items = userArray.map((item, index) => {
        return (<Picker.Item key={item.pk} label={item.name} value={item.pk} />)
    })

    return (
        <SafeAreaView style={Style.cointainer}>

            {isLoding ? (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
            ) : (
                <View style={{ padding: 15, flexDirection: 'column', flex: 1 }}>

                    <TouchableOpacity style={{
                        justifyContent: 'flex-start', alignItems: 'flex-start'
                    }}>
                        <Icon name={'arrow-back-outline'} type={'ionicon'} size={30}
                            onPress={() => { navigation.goBack() }} />
                    </TouchableOpacity>

                    {/* <View style={{ marginTop: 30, borderColor: Colors.lightblack, borderWidth: 1, borderRadius: 6, }}>
                        {userArray.length > 0 ?
                            <Picker
                                selectedValue={selectedValue}
                                style={{ height: 50 }}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedValue1(itemValue)
                                    setselectedValue1name(userArray[itemIndex].name + "'s Crew")
                                }}
                            >
                                {items}
                            </Picker> : null}
                    </View> */}

                    {validationempty(selectedValue1name) ?
                        <View>
                            <Text style={[Style.text22, { lineHeight: 25, marginTop: 20, fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack }]}>{selectedValue1name}</Text>
                            <Text style={[Style.text14, { marginTop: 10, color: Colors.lightblack, justifyContent: 'center', }]}>Add family and close friends to your crew  Crew members can view and participate in photo sharing. Set permission for each person for the right balance of privacy</Text>
                        </View>
                        : null}



                    <FlatList
                        style={{ marginTop: 10, borderRadius: 8, backgroundColor: Colors.divider }}
                        showsVerticalScrollIndicator={false}
                        data={crewarray}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={{
                                    borderBottomWidth: 1, borderColor: Colors.divider,
                                    padding: 10, flexDirection: 'column'
                                }}>
                                <View style={{ marginTop: 15, flexDirection: 'row', width: '100%' }}>
                                    <Text style={[Style.text18, { color: Colors.TheamColor2, flex: 2 }]}>{item.user.name}</Text>
                                    <TouchableOpacity
                                        style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: '#a3a3a3' }}>
                                        <Text style={[Style.text14, { marginTop: 3, textAlign: 'center', color: Colors.white }]}>Edit</Text>
                                    </TouchableOpacity>

                                </View>
                                <ListItem containerStyle={{ padding: 4, backgroundColor: 'transparent' }}>
                                    <Icon name={'mail'} type={'ionicon'} size={20} color={Colors.lightblack} />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.user.email}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                                {/* <ListItem containerStyle={{ padding: 4, backgroundColor: 'transparent' }}>
                                            <Icon name={'person'} type={'ionicon'} size={20} color={Colors.lightblack} />
                                            <ListItem.Content>
                                                <ListItem.Title>{item.name}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem> */}

                                <ListItem containerStyle={{ padding: 4, backgroundColor: 'transparent' }}>
                                    <Icon name={'call-sharp'} type={'ionicon'} size={20} color={Colors.lightblack} />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.user.mobile}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>


                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<NoData itemtext="No Crew Member" />}
                    />


                    <TouchableOpacity
                        onPress={() => {
                            setinfoclick(true)

                        }}
                        style={[Style.buttonStyle2, { width: '50%', marginTop: 20, justifyContent: 'center', alignSelf: 'center' }]}>
                        <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Add Crew Member</Text>
                    </TouchableOpacity>


                    <Modal
                        useNativeDriver={false}
                        animationType="slide"
                        transparent={true}
                        visible={infoclick}
                        onRequestClose={() => {
                            setinfoclick(!infoclick);
                        }}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView1}>
                                <ScrollView contentContainerStyle={styles.modalView}>

                                    <View style={[Style.cointainer, { justifyContent: 'center', padding: '3%' }]}>
                                        <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                                            <Icon onPress={() => { setinfoclick(false) }}
                                                name={'close'} type={'ionicon'} size={25} color={Colors.gray} />
                                        </View>
                                        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                            <View >

                                                <Text style={[Style.text22, { marginTop: 20, lineHeight: 25, fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 8, color: Colors.lightblack, }]}>Invite Crew Members</Text>

                                                <Text style={[Style.text14, { lineHeight: 16, marginBottom: 20, color: Colors.lightblack, }]}>Please enter email to invite Crew</Text>


                                                <View style={{ paddingVertical: "4%" }}>
                                                    {/* <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, marginBottom: 6, color: Colors.lightblack, }]}>Select Property</Text>

                                                    <View style={{ borderColor: Colors.lightblack, borderWidth: 1, borderRadius: 6, }}>
                                                        {userArray.length > 0 ?
                                                            <Picker
                                                                selectedValue={selectedValue}
                                                                style={{ height: 50 }}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    setSelectedValue(itemValue)
                                                                }}
                                                            >
                                                                {items}
                                                            </Picker> : null}
                                                    </View> */}

                                                    <Text style={[Style.text14, { fontFamily: CustomeFonts.Poppins_Bold, color: Colors.lightblack, }]}>Enter Email</Text>

                                                    <TextInput
                                                        style={[Style.textInput]}
                                                        onChangeText={(text) => setEmail(text)}
                                                        title="Email"
                                                        placeholderTextColor={Colors.gray_d1}
                                                        value={email}
                                                        selectionColor={Colors.TheamColor2}
                                                    />

                                                </View>

                                                <View style={[Style.buttonStyle2, { marginBottom: 30 }]}>
                                                    {iisLoding ?
                                                        <View >
                                                            <Indicator />
                                                        </View> : <TouchableOpacity
                                                            style={{ width: '100%' }}
                                                            onPress={() => {
                                                                apiCall_Invite()
                                                            }}
                                                        >
                                                            <Text style={[Style.text16, { lineHeight: 20, textAlign: 'center', width: '100%', color: Colors.white }]}>Invite</Text>
                                                        </TouchableOpacity>}

                                                </View>




                                            </View>

                                        </ScrollView>
                                    </View>

                                </ScrollView>
                            </View>

                        </View>
                    </Modal>


                </View>
                // </ScrollView>
            )
            }
        </SafeAreaView >
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(22, 27, 70, 0.5)'

    },
    modalView: {
        width: '90%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 10,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2
    },
    modalView1: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },

})


export default Home;


