import { View, Text } from 'react-native'
import React from 'react'
import RequestDetails from '../../src/components/RequestDetails'
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const MecRequestDetails = () => {

 const param = useGlobalSearchParams();

 const date =param.date;
 const username = param.user

 

  return (
    <View>
      <RequestDetails date={date} username={username}/>
    </View>
  );
}

export default MecRequestDetails