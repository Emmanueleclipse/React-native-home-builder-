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
    Modal,
    Linking,
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
import ImageViewer from 'react-native-image-zoom-viewer';

const Home = ({ navigation, route }) => {
    const { pr_id, item } = route.params;
    const [isLoding, setLoding] = useState(false);
    const [userArray, setuserArray] = useState('')
    const isFocused = useIsFocused()
    const [showDes, setshowDes] = useState(false);
    const [showimage, setshowImage] = useState(false);
    const [showpdf, setshowpdf] = useState(false);
    const [zoomImage, setzoomImage] = useState(false);


    // useEffect(() => {
        
    //     // apiCall_proprtylist()
    // }, [isFocused]);


    const apiCall_proprtylist = async () => {
        var access = await AsyncStorage.getItem('access')
        // console.log("======access", access)
        setLoding(true);

        const headers = {
            'Authorization': 'Bearer ' + access,
            "content-type": "application/json"
        };
        var url;
        if (validationempty(pr_id)) {
            url = 'api/property/' + pr_id
        }
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                console.log("======response.data", response.data)
                if (response.data != null) {
                    setuserArray(response.data)
                    // console.log("======response", userArray)
                }

            }).catch(function (error) {
                setLoding(false);
                if (error.response) {
                    showToast(JSON.stringify(error.response.data) + "", "error")
                }
            });

    };
    const handleClick = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // console.log("Don't know how to open URI: " + this.props.url);
            }
        });
    };

    console.log('Attachments', item.activities[0])
    return (
        <SafeAreaView style={Style.cointainer}>

            <Text style={[Style.text16, { backgroundColor: Colors.divider, fontFamily: CustomeFonts.Poppins_Bold, height: 56, color: Colors.lightblack, justifyContent: 'center', textAlignVertical: "center", textAlign: 'center' }]}>Details</Text>

            {isLoding ?
                <View style={{ alignItems: 'center', }}>
                    <Indicator></Indicator>
                </View>
                :
                <View 
                    style={{ marginTop: 5, padding: 15, borderRadius: 10, margin: 5, elevation: 5, backgroundColor: 'white' }}>
                    <Text style={[Style.text16, { fontFamily: CustomeFonts.Poppins_Bold, color: Colors.TheamColor3 }]}>{item.name + ""}</Text>
                    <View style={{ flexDirection: 'row' }} >
                        <Text onPress={handleClick} style={[Style.text14, { marginTop: 10, flex: 1, }]}>{item.address} , {item.state}</Text>
                        <Text style={[Style.text12, { marginTop: 10 }]}>{item.activities[0]._from} - {item.activities[0]._to}</Text>


                    </View>
                    <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View>
                    <TouchableOpacity onPress={() => setshowDes(!showDes)} style={{ flexDirection: "row", paddingVertical: 5 }}  >
                        <Text style={[Style.text16, { flex: 1, marginTop: 10, color: Colors.TheamColor3, fontFamily: CustomeFonts.Poppins_Medium }]}>Description</Text>
                        <Icon name={!showDes ? 'chevron-down' : 'chevron-up'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                    </TouchableOpacity>
                    {
                        showDes ?
                            <Text style={[Style.text14]}>{item.activities[0].description}</Text>
                            : null
                    }
                    <TouchableOpacity onPress={() => setshowImage(!showimage)} style={{ flexDirection: "row", paddingVertical: 5 }}  >
                        <Text style={[Style.text16, { flex: 1, marginTop: 10, color: Colors.TheamColor3, fontFamily: CustomeFonts.Poppins_Medium }]}>Images/Video</Text>
                        <Icon name={!showimage ? 'chevron-down' : 'chevron-up'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                    </TouchableOpacity>
                    {
                        showimage ?

                            item.activities[0].attachment !== null && !(item.activities[0].attachment.includes('.doc') && !item.activities[0].attachment.includes('.csv') && !item.activities[0].attachment.includes('.pdf')) ?

                                <TouchableOpacity style={{
                                    width: '100%', height: 150,
                                }} onPress={() =>
                                    setzoomImage(true)} >

                                    <Image
                                        resizeMode='cover'
                                        style={{
                                            justifyContent: 'center', alignSelf: 'center', marginBottom: 4,
                                            height: '100%', width: '100%'
                                        }}
                                        source={{ uri: Urls.imageUrl + item.activities[0].attachment }} />
                                </TouchableOpacity>
                                :
                                <Text style={[Style.text14, { textAlign: 'center', marginVertical: 10 }]}>Data Not Found</Text>

                            :
                            null

                    }
                    <TouchableOpacity onPress={() => setshowpdf(!showpdf)} style={{ flexDirection: "row", paddingVertical: 5 }}  >
                        <Text style={[Style.text16, { flex: 1, marginTop: 10, color: Colors.TheamColor3, fontFamily: CustomeFonts.Poppins_Medium }]}>Pdf, doc, csv</Text>
                        <Icon name={!showpdf ? 'chevron-down' : 'chevron-up'} type={'material-community'} color={Colors.TheamColor2} size={35} style={{ width: 40, justifyContent: 'flex-start' }} />
                    </TouchableOpacity>
                    {
                        showpdf ?
                            item.activities[0].attachment !== null && (item.activities[0].attachment.includes('.doc') || item.activities[0].attachment.includes('.csv') || item.activities[0].attachment.includes('.pdf')) ?
                                <TouchableOpacity onPress={() => handleClick(Urls.imageUrl + item.activities[0].attachment)} >
                                    <Text style={[Style.text14, { textAlign: 'center' }]}>{Urls.imageUrl}{item.activities[0].attachment}</Text>
                                </TouchableOpacity>
                                :
                                <Text style={[Style.text14, { textAlign: 'center' }]}>Data Not Found</Text>
                            : null
                    }
                </View>

                // <FlatList
                //     showsVerticalScrollIndicator={false}
                //     data={userArray}
                //     renderItem={({ item, index }) => (
                //         <TouchableOpacity
                //             style={{ marginTop: 5, paddingHorizontal: 5, }}>
                //             <View style={{ flexDirection: 'row', paddingVertical: 6 }}>

                //                 <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', paddingHorizontal: 8 }}>
                //                     <Text style={[Style.text16, { flex: 2, fontFamily: CustomeFonts.Poppins_SemiBold }]}>{item.milestone_name}</Text>
                //                     <Text style={[Style.text12, { flex: 2, marginTop: 4 }]}>{item.description}</Text>
                //                     <Text style={[Style.text12, { flex: 2, marginTop: 4 }]}>{item._from} TO {item._to}</Text>
                //                 </View>
                //             </View>
                //             <View style={{ marginTop: 5, height: 1, width: '100%', backgroundColor: Colors.divider }}></View>
                //         </TouchableOpacity>
                //     )}
                //     keyExtractor={(item, index) => index.toString()}
                //     ListEmptyComponent={<NoData />}
                // />

            }
            {
                zoomImage ?
                    <Modal
                        animationType="slide"
                        visible={true}
                        transparent={true}
                        onRequestClose={() => {
                            setzoomImage(false);
                        }}
                        onDismiss={() => {
                            setzoomImage(false);
                        }}>
                        <View style={{
                            flex: 1,
                            height: '100%',
                            backgroundColor: Colors.white
                        }}>
                            <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setzoomImage(false); }}
                                imageUrls={[{ props: { source: '' }, url: Urls.imageUrl + item.activities[0].attachment }]}
                            />
                        </View>
                    </Modal>
                    : null
            }
        </SafeAreaView >
    );
};



export default Home;

