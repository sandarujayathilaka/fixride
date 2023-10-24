import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import PaymentPortal from "../../src/components/PaymentPortal";

const MecRequestDetails = () => {


const route = useRoute();

const { Requestid } = route.params;

console.log("1", Requestid);

let RequestId = Requestid;

console.log("2", RequestId);
 

const { Payment } = route.params;
let payment = Payment
console.log("paymentportal", payment);
  return (
    <View>
      <PaymentPortal requestId={RequestId} paymentt={payment} />
    </View>
  );
};

export default MecRequestDetails;
