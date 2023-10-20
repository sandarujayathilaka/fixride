import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import ReqStatusGMside from '../../src/components/ReqStatusGMside'

export default function Status() {

   const param = useGlobalSearchParams();
   const RequestId = param.Id;
  

  return (
    <View>
      <ReqStatusGMside RequestId={RequestId}/>
    </View>
  );
}