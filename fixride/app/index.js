import { useState } from "react";
import { Text,SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import CateCard from "../src/components/CateCard";
import MechHome from '../src/components/mechHome';
import Test from "../src/components/text";
import Job from "../src/components/job";
import JobOverview from "../src/components/jobOverview";
import JobStatusUpdate from "../src/components/JobStatusUpdate";
import Report from "../src/components/report";
import MechStatus from "../src/components/mechStatus";

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
            <MechStatus/>
          


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default index;
