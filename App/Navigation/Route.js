
import React, { memo } from 'react';
import { Icon } from 'react-native-elements'

import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, getFocusedRouteNameFromRoute, } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LocalData } from '../Common/Urls';

import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Feed from '../Screens/Feed';
import HomeOwnerReport from '../Screens/HomeOwnerReport';
import HomeBuilderReport from '../Screens/HomeBuilderReport';
import Buildphase from '../Screens/Buildphase';
import Messages from '../Screens/Messages';
import Schedule from '../Screens/Schedule';
import Schedule1 from '../Screens/Schedule1';
import Headline from '../Screens/Headline';
import More from '../Screens/More';
import NewMessage from '../Screens/NewMessage';
import MessagesProperty from '../Screens/MessagesProperty';
import Crew from '../Screens/Crew';
import Crewdetail from '../Screens/Crewdetail';
import Addcrew from '../Screens/Addcrew';
import ManageHome from '../Screens/ManageHome';
import UserSetting from '../Screens/UserSetting';
import ResetPassword from '../Screens/ResetPassword';
import CreateProperty from '../Screens/CreateProperty';
import EditProprty from '../Screens/EditProprty';
import CreateProperty1 from '../Screens/CreateProperty1';
import PurchaseCredit from '../Screens/PurchaseCredit';
import Payment from '../Screens/Payment';
import WebLoad from '../Screens/WebLoad';
import ImageDetail from '../Screens/ImageDetail';
import NewMessageProperty from '../Screens/NewMessageProperty';
import ScheduleHome from '../Screens/ScheduleHome';


import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Images from '../Theme/Images';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();
const TabBottom = createBottomTabNavigator();

const { height, width } = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import Register from '../Screens/Register';


const TabStack = () => {
  return (
    <TabBottom.Navigator
      lazy='true'
      initialRouteName="Home"
      backBehavior = "initialRoute"
      // backBehavior='Home'
      tabBarOptions={{
        showLabel: true,
        activeTintColor: Colors.TheamColor2,
      }}
    >

      <TabBottom.Screen
        name="Home"
        component={Feed}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <TabBottom.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Icon type='material-community' name="message-bulleted" color={color} size={size} />
          ),
        }}
      />

      <TabBottom.Screen
        name="Schedule"
        component={Schedule}
        initialParams={{ pr_id: '' }}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Icon type='material' name="notifications" color={color} size={size} />),
        }}
      />

      {/* {LocalData.FLAG == '2' ? null :
        <TabBottom.Screen
          name="Headline"
          component={Headline}
          options={{
            tabBarLabel: 'Headline',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" color={color} size={size} />
            ),
          }}
        />
      } */}

      <TabBottom.Screen
        name="More"
        component={More}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" color={color} size={size} />
          ),
        }}
      />


    </TabBottom.Navigator>
  );
}

const Route = () => (

  <NavigationContainer >
    <Stack.Navigator initialRouteName='Splash' >
      <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <Stack.Screen name='Home' component={TabStack} options={{ headerShown: false }} />
      <Stack.Screen name='HomeOwnerReport' component={HomeOwnerReport} options={{ headerShown: false }} />
      <Stack.Screen name='HomeBuilderReport' component={HomeBuilderReport} options={{ headerShown: false }} />
      <Stack.Screen name='Buildphase' component={Buildphase} options={{ headerShown: false }} />
      <Stack.Screen name='NewMessage' component={NewMessage} options={{ headerShown: false }} />
      <Stack.Screen name='NewMessageProperty' component={NewMessageProperty} options={{ headerShown: false }} />
      <Stack.Screen name='Messages' component={Messages} options={{ headerShown: false }} />
      <Stack.Screen name='MessagesProperty' component={MessagesProperty} options={{ headerShown: false }} />
      <Stack.Screen name='Crew' component={Crew} options={{ headerShown: false }} />
      <Stack.Screen name='Crewdetail' component={Crewdetail} options={{ headerShown: false }} />
      <Stack.Screen name='Addcrew' component={Addcrew} options={{ headerShown: false }} />
      <Stack.Screen name='Schedule1' component={Schedule1} options={{ headerShown: false }} />
      <Stack.Screen name='ManageHome' component={ManageHome} options={{ headerShown: false }} />
      <Stack.Screen name='UserSetting' component={UserSetting} options={{ headerShown: false }} />
      <Stack.Screen name='ResetPassword' component={ResetPassword} options={{ headerShown: false }} />
      <Stack.Screen name='CreateProperty' component={CreateProperty} options={{ headerShown: false }} />
      <Stack.Screen name='CreateProperty1' component={CreateProperty1} options={{ headerShown: false }} />
      <Stack.Screen name='EditProprty' component={EditProprty} options={{ headerShown: false }} />
      <Stack.Screen name='PurchaseCredit' component={PurchaseCredit} options={{ headerShown: false }} />
      <Stack.Screen name='Payment' component={Payment} options={{ headerShown: false }} />
      <Stack.Screen name='WebLoad' component={WebLoad} options={{ headerShown: true }} />
      <Stack.Screen name='ImageDetail' component={ImageDetail} options={{ headerShown: true }} />
      <Stack.Screen name='ScheduleHome' component={ScheduleHome} options={{ headerShown: false }} />

   </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  HeaderTextstyle: {
    fontFamily: CustomeFonts.good_time_rg,
    fontSize: 14, textTransform: 'uppercase'
  },
  con: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: 'black'
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'transparent',
    width: 40,
    borderRadius: 20,
  }
});

export default Route;