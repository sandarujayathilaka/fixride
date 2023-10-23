import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import PaymentPortal from "../../src/components/PaymentPortal";

const MecRequestDetails = () => {
  // const param = useGlobalSearchParams();

  // const RequestId = param.Id;
 
  const route = useRoute();
  const { Requestid } = route.params;
  console.log("1", Requestid);
  let RequestId = Requestid;
  console.log("2", RequestId);
  return (
    <View>
      <PaymentPortal RequestId={RequestId} />
    </View>
  );
};

export default MecRequestDetails;
