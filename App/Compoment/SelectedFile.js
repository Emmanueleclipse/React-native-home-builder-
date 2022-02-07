import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

import Colors from '../Theme/Colors'
import Icon2 from 'react-native-vector-icons/AntDesign'
import Style from '../Theme/Style';

export default function selectedFile ({ onPress, fileName }){
    return (
        <View style={{ flexDirection: "row", backgroundColor: Colors.TheamColor, elevation: 5, padding: 10, borderRadius: 10, flex: 1, alignItems: 'center', marginBottom: 5 }} >
            <Text style={[Style.text14, { textAlignVertical: 'center', flex: 1, marginHorizontal: 6 }]}>{fileName}</Text>
            <TouchableOpacity onPress={onPress} >
                <Icon2 name="delete" color={'red'} size={18} />
            </TouchableOpacity>
        </View>
    )
}