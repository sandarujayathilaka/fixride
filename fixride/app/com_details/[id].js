import { View, Text } from 'react-native'
import React from 'react'
import CompletedDetails from '../../src/components/History/CompletedDetails'
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const ComRequestDetail = () => {

const route = useRoute();
const { Date } = route.params;
console.log("1", Date);
let date = Date;
console.log("2", date);


const { Username } = route.params;
console.log("1", Username);
let username = Username;
console.log("2", username);

const { Requestid } = route.params;
console.log("1", Requestid);
let RequestId = Requestid;
console.log("2", RequestId);
  return (
    <View>
      <CompletedDetails date={date} RequestId={RequestId} username={username} />
    </View>
  );
}

export default ComRequestDetail