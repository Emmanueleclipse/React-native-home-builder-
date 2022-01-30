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
import Style, { HEIGHT } from '../Theme/Style';
import { LocalData, Params, Urls } from '../Common/Urls';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Home = ({ navigation, route }) => {
    const { image } = route.params;
    
    // component
    navigation.setOptions({ title: "Attachment" });

    return (
        <SafeAreaView style={Style.cointainer}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10
            }}>
                <Image
                    resizeMode='contain'
                    style={{
                        width: '100%', height: '100%', borderRadius: 8
                    }}
                    source={{ uri: Urls.imageUrl + image }} />
            </View>
        </SafeAreaView >
    );
};



export default Home;


