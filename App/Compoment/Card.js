import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import Moment from 'moment'

export default function Card (props){
    const { children, item, index } = props
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }} >
                <Text style={[Style.text14, { flex: 1 }]}>{(index + 1)}.  {item.milestone_name}</Text>
            </View>
            {   
                item.status === 'approved' ? (
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={[Style.text14, styles.statusApr]}>{item.status}</Text>
                    </View>
                ):(
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={[Style.text14, styles.statusAwait]}>{item.status}</Text>
                    </View>
                )
            }
            <Text style={[Style.text14, { marginTop: 8 }]}>Due {Moment(item._to).format('MMMM DD, YYYY')}</Text>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1, 
        borderColor: Colors.divider,
        flexDirection: 'column', 
        paddingVertical: 10, 
        marginTop: 20, 
        backgroundColor: Colors.TheamColor, 
        elevation: 5, 
        margin: 5, 
        paddingVertical: 15, 
        padding: 10, 
        borderRadius: 10
    },
    statusApr: {
        flexShrink: 1, 
        padding: 4, 
        borderColor: Colors.gray_d1, 
        borderWidth: 1, 
        borderRadius: 8, 
        color: Colors.TheamColor4, 
        marginTop: 8
    },
    statusAwait: {
        flexShrink: 1, 
        padding: 4, 
        borderColor: Colors.gray_d1, 
        borderWidth: 1, 
        borderRadius: 8, 
        color: '#FB0015', 
        marginTop: 8
    }
})