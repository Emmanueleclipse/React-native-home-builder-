import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Platform, Animated, Image, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../Theme/Colors';
import Images from '../Theme/Images';
import Style from '../Theme/Style';
import { validationempty } from './Validations';

export const showToast = (msg, type) => {
    if (msg) {
        Toast.show({
            text1: msg,
            // text2: msg2,
            type: type,   //'success | error | info',
            position: 'top',
            visibilityTime: 9000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
    }
}

export const Indicator = () => {
    return (
        <ActivityIndicator size='large' color={Colors.TheamColor4} />
    )
}


export const NoData = (props) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginVertical: '20%' }}>
            <Image source={Images.nodata} style={{ height: 120, width: 250 }} resizeMode='contain' />
            <Text style={[Style.text12, { width: '100%', textAlign: "center" }]}>{validationempty(props.itemtext) ? props.itemtext : 'No Data Available'}</Text>
        </View>
    )
}



