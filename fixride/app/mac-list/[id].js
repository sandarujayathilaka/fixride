import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import MechanicList from '../../src/components/MechanicList';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";


export default function AvailableMac() {

  //  const param = useGlobalSearchParams();
  //  const RequestId = param.Id;

   const route = useRoute();
  
   const { Requestid } = route.params;
   let RequestId = Requestid;

  

  return (
    <View>
      <MechanicList RequestId={RequestId}/>
    </View>
  );
}