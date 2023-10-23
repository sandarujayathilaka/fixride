import { View, Text } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import MechanicList from "../../src/components/MechanicList";
import { useRoute } from "@react-navigation/native";

export default function AvailableMac() {
  const route = useRoute();
  const { Id } = route.params;

  let RequestId = Id;

  return (
    <View>
      <MechanicList RequestId={RequestId} />
    </View>
  );
}
