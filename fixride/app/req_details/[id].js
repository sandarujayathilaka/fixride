import { View, Text } from 'react-native'
import React from 'react'
import RequestDetails from '../../src/components/RequestDetails'
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const MecRequestDetails = () => {

 const param = useGlobalSearchParams();

 const date =param.date;
 const username = param.user
const RequestId = param.Id;
console.log("Req",RequestId)


  return (
    <View>
      <RequestDetails date={date} RequestId={RequestId} username={username} />
    </View>
  );
}

export default MecRequestDetails