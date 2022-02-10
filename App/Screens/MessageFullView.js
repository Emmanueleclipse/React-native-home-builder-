import React, { Component } from 'react';
import { View, Text, TextInput, ActivityIndicator,RefreshControl,StatusBar,Platform, TouchableOpacity, KeyboardAvoidingView,Keyboard,Image, SafeAreaView, ScrollView, Dimensions, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { displaySuccessToast, displayErrorToast, displayNetworkError} from "../../../utils/snackbar";
import {Appbar} from 'react-native-paper';
import Style, { HEIGHT } from '../Theme/Style';
import Colors from '../Theme/Colors';
import Moment from 'moment';
import { LocalData, Params, Urls } from '../Common/Urls';
class Conversations extends Component {

    constructor(props){
        super(props);
        this.state={
            ticket:'',
            id:'',
            currency:'',
            loadingMore:false,
            userid:'',
            message:'',
            width:0,
            image:'',
            iname:'',

        }
    }



    

    
    
    render() {
        const {message}=this.props.route.params
        console.log(message)
        return (
            <View style={{ flex: 1, }}>

            <StatusBar barStyle="light-content" backgroundColor='#343b41'/>
            <Appbar.Header style={{ backgroundColor:'#343b41',height:0}}/>
                
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
                <View style={{justifyContent: 'space-between' }}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex: 0.1,paddingVertical:20,paddingHorizontal:10 }}>
                                <AntDesign name="arrowleft" style={{ fontSize:24, color: '#000', marginRight:10,}}  onPress={()=>{
                                    this.props.navigation.goBack()
                                }}/>
                            </View>
                            
                        </View>
                </View>
                
                                    
                
                <KeyboardAvoidingView style={{flex:1,width:'100%'}} behavior= {(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={50} enabled>
       
                <View style={{ flex:1, paddingHorizontal: 10, marginTop:0,}}>
                
            <ScrollView
            contentContainerStyle={{paddingBottom:10}}
              ref={ref => {this.scrollView = ref}}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
       
       <View
                                    style={{
                                        alignItems: 'center',
                                        flex: 1, 
                                        flexDirection: 'row', paddingVertical: 10,borderBottomWidth:1, borderBottomColor:'lightgrey',borderRadius:10
                                    }}
                                    >
                                    
                                    <View style={{ flex: 1, paddingHorizontal:10 ,marginHorizontal:8 }} >
                                        <View style={{ flexDirection: 'row',}} >
                                            <Text style={[Style.text18, { flex: 1, color: Colors.TheamColor2 }]}>{message.subject}</Text>
                                            <Text style={[Style.text14]}>{Moment(message.created_at).format('yyyy-MM-DD ')}</Text>
                                        </View>
                                        <Text style={[Style.text16, { flex: 1, color: Colors.TheamColor2,marginTop:20 }]}>{message.message}</Text>
                                        <Text style={[Style.text16, {paddingTop:10, flex: 1 }]}>{message.send_by}</Text>
                                    </View>
                                    {(message.attachment!=null) ? <Icon type='entypo' name="attachment" size={15}
                                        onPress={() => {
                                            console.log(Urls.imageUrl + message.attachment)

                                            {
                                                (message.attachment).endsWith('.doc') ||
                                                    (message.attachment).endsWith('.docx') ||
                                                    (message.attachment).endsWith('.pdf') ?
                                                    linkname=Urls.imageUrl + message.attachment
                                                    :
                                                    this.props.navigation.navigate('WebLoad', { linkname: Urls.imageUrl + message.attachment })
                                            }
                                        }} /> : <View style={{ width: 15 }} />}
                                    
                                </View>
                            
                               <View style={[Style.buttonStyle2, { flex: 4,width:'50%',marginTop:40,alignSelf:'center',justifyContentL:'center',alignItems:'center' }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('MessageReply', {message:message})
                                }}
                                style={{ width: '100%' }}>
                                <Text style={[Style.text16, { textAlign: 'center', width: '100%', color: Colors.white }]}>Reply</Text>
                            </TouchableOpacity>

                        </View>
            
        </ScrollView>
    
                    
                                    
                </View>    
                
                 
                            </KeyboardAvoidingView>
            </SafeAreaView>
            </View>
        );
    }
}

export default Conversations;
