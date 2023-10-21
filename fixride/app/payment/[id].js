import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import PaymentPortal from "../../src/components/PaymentPortal";

const MecRequestDetails = () => {
  const param = useGlobalSearchParams();

  const RequestId = param.Id;
  const payment = param.payment;
 

  return (
    <View>
      <PaymentPortal RequestId={RequestId} payment={payment} />
    </View>
  );
};

export default MecRequestDetails;
