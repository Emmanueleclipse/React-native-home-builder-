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
    const [mimeType, setMimeType] = useState([])

    useEffect(() => {
        loadFiles()
    },[])

    const loadFiles = () => {
        item.attachments.map(item => setMimeType(item.type))
    }
    let data = []
    const Uploaded = item.activities.map(item => item.attachments.map(item => {
       return data.push({ type: item.type, attachment: item.attachment})
    }))
    
    const images = data.map(item => item).filter(item => {
        let file = item.type
        return  file !== 'pdf' && file !== 'doc' && file !== 'csv'
    })

    const otherFiles = data.map(item => item).filter(item => {
        let file = item.type
        return file != 'jpg' && file != 'jpeg' & file != 'png' 
    })

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
        Axios.get(Urls.baseUrl + url, { headers })
            .then(response => {
                setLoding(false);
                if (response.data != null) {
                    setuserArray(response.data)
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

                            images !== null  ?

                                <FlatList
                                    data={images}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) =>  (
                                        <TouchableOpacity style={styles.list} onPress={() =>
                                            setzoomImage(true)} >
                                            <Image
                                                resizeMode='center'
                                                style={{ marginBottom: 4, height: '100%', width: '100%' }}
                                                source={{ uri: Urls.imageUrl + item.attachment }} 
                                                />
                                        </TouchableOpacity>
                                    )}
        
                                />
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
                            otherFiles.length > 0  ?
                                <FlatList
                                    data={otherFiles}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleClick(Urls.imageUrl + item.attachments)} >                 
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                                <Image
                                                    resizeMode='contain'
                                                    style={{ width: 20, height: 20, marginRight: 10}}
                                                    source={item.type === 'pdf' && require('../assets/images/pdf.png') || item.type === 'csv' && require('../assets/images/csv.png' || item.type == 'doc' && require('../assets/images/doc.png' ))}
                                                />
                                                <Text style={[Style.text14, { textAlign: 'center' }]}>{Urls.imageUrl}{item.attachment}</Text> 
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                                :
                                <Text style={[Style.text14, { textAlign: 'center' }]}>Data Not Found</Text>
                            : null
                    }
                </View>

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

const { width } = Dimensions.get('screen')
const styles = StyleSheet.create({
    list : {
        width: width ,
        height: 200
    }
})


export default Home;

