import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import ReqStatus from '../../src/components/ReqStatus'

export default function Status() {

   const param = useGlobalSearchParams();
   const RequestId = param.Id;
  

  return (
    <View>
      <ReqStatus RequestId={RequestId}/>
    </View>
  );
}