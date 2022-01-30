import React, { useEffect, useState } from 'react';
import {
    Alert, Platform,
    PermissionsAndroid,
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Button,
    Dimensions,
    Linking,
} from 'react-native';
import Colors from '../Theme/Colors';
import Style, { HEIGHT } from '../Theme/Style';
import { WebView } from 'react-native-webview';

const Home = ({ navigation, route }) => {

    const { linkname } = route.params
    const [loding, setLoding] = useState(false);

    useEffect(() => {
        console.log("linkname", linkname)
    }, [navigation])

    // component
    navigation.setOptions({ title: "HomeApp" });


    return (
        <SafeAreaView style={Style.cointainer}>
            <View style={[Style.cointainer, { padding: '3%' }]}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{
                        uri: linkname + ""
                    }}
                    resizeMode='contain'
                // startInLoadingState={true}
                // javaScriptEnabled={true}
                />
            </View>
        </SafeAreaView>
    );
};
export default Home;




