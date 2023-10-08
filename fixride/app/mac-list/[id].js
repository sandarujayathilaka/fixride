import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import MechanicList from '../../src/components/MechanicList'

export default function AvailableMac() {

   const param = useGlobalSearchParams();
   const RequestId = param.Id;
  

  return (
    <View>
      <MechanicList RequestId={RequestId}/>
    </View>
  );
}