// import { useState } from "react";
// import { Text,SafeAreaView, ScrollView, View } from "react-native";
// import { Stack, useRouter } from "expo-router";
// import CateCard from "../src/components/CateCard";
// import Test from "../src/components/text";
// import Feedback from "../src/components/Feedback";
// import { ToastProvider } from 'react-native-toast-message';
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import MyActivity from "../src/components/MyActivity";
// import Home from "../src/components/Home";


// const Tab = createMaterialTopTabNavigator();
// function index() {

//     const router = useRouter();

//   return (

//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <Stack.Screen
//         options={{
//           headerTitle: "",
//           headerShadowVisible: false,
//         }}
//       />
//  <View>  

//       <MyActivity />

       
//         </View>
//        {/* <ScrollView showsVerticalScrollIndicator={false}>
//         <View
//           style={{
//             flex: 1,
//             padding:5,
//           }}
//         >
          
//             <CateCard/>
//             <Test/>


//         </View>
//        </ScrollView> 
//  <ScrollView showsVerticalScrollIndicator={false}>
//         <View
//           style={{
//             flex: 1,
//             padding:5,
//           }}
//         >  
//             <Feedback/>
//         </View>
//        </ScrollView>  */}
//      </SafeAreaView>
//   );
// }

// export default index;


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChooseLocation from '../src/components/ChooseLocation';
import Home from '../src/components/Home';
import TrackLive from '../src/components/TrackLive';
const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      {/* <Tab.Screen name="home" component={Home} />
        <Tab.Screen name="chooseLocation" component={ChooseLocation} /> */}
        <Tab.Screen name="trackLive" component={TrackLive} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

