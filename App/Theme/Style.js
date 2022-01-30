import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'
import CustomeFonts from './CustomeFonts'

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

const Style = StyleSheet.create({
    cointainer: {
        height: '100%', width: '100%',
        flex: 1,
        backgroundColor: Colors.TheamColor,
    },
    rowView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowView_card: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        // borderWidth: 1,
        // borderColor: Colors.TheamColor2,
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        borderRadius: 8,
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 2,
    },
    buttonStyle: {
        backgroundColor: Colors.TheamColor2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: '3%',
        elevation: 5
    },

    home_text_style: {
        paddingVertical: 6,
        width: '100%',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        // backgroundColor: Colors.TheamColor2,
        color: Colors.TheamColor3,
        textAlign: 'center',
    },

    centerView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle2: {
        marginTop: '2%',
        paddingVertical: '4%',
        backgroundColor: Colors.TheamColor2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 5
    },
    buttonStyle22: {
        marginTop: '2%',
        paddingVertical: '4%',
        backgroundColor: Colors.TheamColor2,
        borderWidth:1,
        borderColor : Colors.gray_d1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        elevation: 5
    },

    textInput: {
        fontSize: 12,
        fontFamily: CustomeFonts.brown_pro_bold,
        color: Colors.black,
    },
    textInputView: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 10,
    },

   
    text22: {
        lineHeight: 23,
        fontSize: 22,
        fontFamily: CustomeFonts.Poppins_Regular,
    },
    text18: {
        lineHeight: 20,
        fontSize: 18,
        fontFamily: CustomeFonts.Poppins_Bold,
    },
    text14: {
        lineHeight: 16,
        fontSize: 14,
        textAlignVertical:'center',
        fontFamily: CustomeFonts.good_time_rg,
    },
    text12: {
        lineHeight: 13,
        fontFamily: CustomeFonts.good_time_rg,
        fontSize: 12
    },
    text16: {
        lineHeight: 18,
        fontFamily: CustomeFonts.good_time_rg,
        fontSize: 16,
    },
    headerViewMain: {
        padding: '2%', backgroundColor: Colors.TheamColor2, height: HEIGHT * 0.07, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',

    },
    headerViewSub: {
        backgroundColor: Colors.TheamColor, height: HEIGHT * 0.07, paddingVertical: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
    },
    headerViewTitle: {
        fontFamily: CustomeFonts.good_time_rg,
        backgroundColor: Colors.TheamColor, height: HEIGHT * 0.05, paddingVertical: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
    },
    divider: {
        borderWidth: 1, borderColor: Colors.TheamColor2, borderRadius: 20,
    },
    card: {
        padding: '1%', marginVertical: '1%', borderRadius: 6,
        elevation: 2,
        backgroundColor: Colors.TheamColor2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2.0,
    }
   
})
export default Style
