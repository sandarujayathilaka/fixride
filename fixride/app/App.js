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


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChooseLocation from '../src/components/History/ChooseLocation';
import Home from '../src/components/History/Home';
import TrackLive from '../src/components/History/TrackLive';
import MyActivity from '../src/components/History/MyActivity';
import { Text,SafeAreaView, ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect, Suspense } from "react";
import { firebase } from '../src/config/firebase';

import Login from "../src/components/History/Login";
import Registration from "../src/components/History/Registration";
import Dashboard from "../src/components/History/Dashboard";
//import Header from "../src/components/Header";

const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

// function MyTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="MyActivity" component={MyActivity} />
//       <Tab.Screen name="TrackLive" component={TrackLive} />
//     </Tab.Navigator>
//   );
// }

function App(){
  const [initializing, setInitalizing] = useState(true);
  const [user, setUser ] = useState();

  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitalizing(false);
  }

  useEffect(()=>{
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);

  if(initializing) return null;

  if(!user){
    return (
      <Stack.Navigator>
        <Stack.Screen
        name ="Login"
        component={Login}
        // options={{
        //   headerTitle:() => <Header name="Deno"/>,
        //   headerStyle:{
        //     height:150,
        //     borderBottomLeftRadius:50,
        //     borderBottomRightRadius:50,
        //     backgroundColor:'#000',
        //     shadowColor:'#000',
        //     elevation:25
        //   }
        // }}
        />

<Stack.Screen
        name ="Registration"
        component={Registration}
        // options={{
        //   headerTitle:() => <Header name="Deno"/>,
        //   headerStyle:{
        //     height:150,
        //     borderBottomLeftRadius:50,
        //     borderBottomRightRadius:50,
        //     backgroundColor:'#000',
        //     shadowColor:'#000',
        //     elevation:25
        //   }
        // }}
        />

      </Stack.Navigator>
    );
  }
  return(
    <Stack.Navigator>
      <Stack.Screen
        name ="MyActivity"
        component={MyActivity}
        // options={{
        //   headerTitle:() => <Header name="Dashboard"/>,
        //   headerStyle:{
        //     height:150,
        //     borderBottomLeftRadius:50,
        //     borderBottomRightRadius:50,
        //     backgroundColor:'#000',
        //     shadowColor:'#000',
        //     elevation:25
        //   }
        // }}
        />
         <Stack.Screen
        name ="TrackLive"
        component={TrackLive}
        />
    </Stack.Navigator>
  );
}


export default ()=> {
  return (
    <NavigationContainer>
           {/* <Tab.Navigator>
         <Tab.Screen name="home" component={Home} />
          <Tab.Screen name="chooseLocation" component={ChooseLocation} /> 
          
       </Tab.Navigator> */}
       {/* <MyActivity/> */}
        
  <App/> 
</NavigationContainer>
    // <View>
    //    <MyActivity/>
    //  </View>
    //  <NavigationContainer>
    //    <Tab.Navigator>
    //     <Tab.Screen name="home" component={Home} />
    //      <Tab.Screen name="chooseLocation" component={ChooseLocation} /> */}
    //      <Tab.Screen name="trackLive" component={TrackLive} />
    //   </Tab.Navigator>
    //  </NavigationContainer> 
  );
}

