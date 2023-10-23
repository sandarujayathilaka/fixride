import { View, Text } from 'react-native'
import React from 'react'
import OngoingDetails from '../../src/components/History/OngoingDetails'
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const OngoingRequestDetail = () => {

//  const param = useGlobalSearchParams();

//  const date =param.date;
//  const username = param.user
// const RequestId = param.Id;
// console.log("Req",RequestId)
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
      <OngoingDetails date={date} RequestId={RequestId} username={username} />
    </View>
  );
}

export default OngoingRequestDetail