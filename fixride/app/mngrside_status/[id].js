import { View, Text } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams } from "expo-router";
import ReqStatusGMside from '../../src/components/ReqStatusGMside'
import { useRoute } from "@react-navigation/native";

export default function ManagerStatus() {

  const route = useRoute();
  const { Id } = route.params;

  let RequestId = Id;


  return (
    <View>
      <ReqStatusGMside RequestId={RequestId}/>
    </View>
  );
}