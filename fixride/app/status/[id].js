import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import ReqStatus from '../../src/components/ReqStatus'
import { useRoute } from "@react-navigation/native";

export default function Status() {

 const route = useRoute();

 const { Requestid } = route.params;

 console.log("1", Requestid);

 let RequestId = Requestid;

 console.log("2", RequestId);
  

  return (
    <View>
      <ReqStatus RequestId={RequestId}/>
    </View>
  );
}