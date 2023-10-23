import { Text,SafeAreaView, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import CateCard from "../src/components/CateCard";
import Test from "../src/components/text";
import RequestDetails from "../src/components/RequestDetails";
import ChooseLocation from "../src/components/History/ChooseLocation";
import Home from "../src/components/History/Home";
import TrackLive from "../src/components/History/TrackLive";
import MyActivity from "../src/components/History/MyActivity";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect, Suspense } from "react";
import { firebase } from "../src/config/firebase";
import Login from "../src/components/History/Login";
import Registration from "../src/components/History/Registration";
import Dashboard from "../src/components/History/Dashboard";
import DisplayContent from "../app/cat_list/[id]";

import Status from "../app/status/[id]";

import MecRequestDetails from "../app/payment/[id]";

import MecRequestDetail from "../app/req_details/[id]";

import GarageInfo from "../app/garage_info/[id]";

import Form from "../app/form/[id]";


const Stack = createStackNavigator();

function App() {
  const [initializing, setInitalizing] = useState(true);

  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);

    if (initializing) setInitalizing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="CateCard">
          <Stack.Screen name="CateCard" component={CateCard} />

          <Stack.Screen
            name="CatList"
            component={DisplayContent}
            options={({ route }) => ({
              title: `Cat List ${route.params.cardid}`,
            })}
          />
          <Stack.Screen
            name="Status"
            component={Status}
            options={({ route }) => ({
              title: `Status ${route.params.Requestid}`,
            })}
          />

          <Stack.Screen
            name="Payment"
            component={MecRequestDetails}
            options={({ route }) => ({
              title: `Payment ${route.params.Requestid,route.params.Payment}`,
            })}
          />

          <Stack.Screen
            name="Req_details"
            component={MecRequestDetail}
            options={({ route }) => ({
              title: `Req_details ${
                (route.params.Requestid,
                route.params.Date,
                route.params.Username)
              }`,
            })}
          />

        

          <Stack.Screen
            name="Garage_info"
            component={GarageInfo}
            options={({ route }) => ({
              title: `Garage_info ${
                (route.params.iid,
                route.params.userlatitude,
                route.params.userlongitude)
              }`,
            })}
          />

          <Stack.Screen
            name="Form"
            component={Form}
            options={({ route }) => ({
              title: `Form ${
                (route.params.garageid,
                route.params.userlatitude,
                route.params.userlongitude)
              }`,
            })}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />

          <Stack.Screen name="Registration" component={Registration} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App

