import { useState } from "react";
import { Text,SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import CateCard from "../src/components/CateCard";
import Test from "../src/components/text";
import GarageMngrDash from "../src/components/GarageMngrDash";
import AddMechanic from "../src/components/AddMechanic";
import GarageMngrDash2 from "../src/components/GarageMngrDash2";
import ReqList from "../src/components/ReqList";
import Ongoings from "../src/components/Ongoings";
import MechanicList from "../src/components/MechanicList";




function index() {

    const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding:5,
          }}
        >
            <CateCard/>
            <GarageMngrDash/>  
         
            <AddMechanic/>
            <Ongoings/>   
            <ReqList/>
            <MechanicList/>
            
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default index;
