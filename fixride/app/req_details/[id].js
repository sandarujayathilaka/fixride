import { View, Text } from 'react-native'
import React from 'react'
import RequestDetails from '../../src/components/RequestDetails'
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const MecRequestDetails = () => {
 const route = useRoute();
 const param = useGlobalSearchParams();

  const date = route.params.date;
 const vehecleNo = param.id;

 console.log("Vehicle Number:",date);
 

  return (
    <View>
      <Text>is</Text>
      <RequestDetails/>
    </View>
  )
}

export default MecRequestDetails