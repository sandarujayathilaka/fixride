import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import PaymentPortal from "../../src/components/PaymentPortal";

const MecRequestDetails = () => {
  const param = useGlobalSearchParams();

  const RequestId = param.Id;
 

  return (
    <View>
      <PaymentPortal RequestId={RequestId} />
    </View>
  );
};

export default MecRequestDetails;
