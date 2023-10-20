import { useState } from "react";
import { Text,SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import CateCard from "../src/components/CateCard";
import Test from "../src/components/text";
import RequestDetails from "../src/components/RequestDetails";

function index() {

    const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding:5,
          }}
        >
            <CateCard/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default index;
