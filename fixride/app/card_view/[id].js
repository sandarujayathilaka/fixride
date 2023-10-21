import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import ReqStatus from "../../src/components/ReqStatus";
import CateCard from "../../src/components/CateCard";

export default function CardView() {

  return (
    <View>
      <CateCard/>
    </View>
  );
}
