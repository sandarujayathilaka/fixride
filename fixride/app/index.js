import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { firebase } from "../src/config/firebase";
import CateCard from "../src/components/CateCard";
import Login from "../src/components/History/Login";
import Registration from "../src/components/History/Registration";
import DisplayContent from "../app/cat_list/[id]";
import Status from "../app/status/[id]";
import MecRequestDetails from "../app/payment/[id]";
import MecRequestDetail from "../app/req_details/[id]";
import GarageInfo from "../app/garage_info/[id]";
import Form from "../app/form/[id]";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// function HomeScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <CateCard />
//     </SafeAreaView>
//   );
// }

// function SettingsScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       {/* Your settings screen content */}
//     </SafeAreaView>
//   );
// }

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="HomeTabs">
          <Stack.Screen name="FIXRIDE" component={HomeTabs} />

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
              title: `Payment ${route.params.Requestid}`,
            })}
          />

          <Stack.Screen
            name="Req_details"
            component={MecRequestDetail}
            options={({ route }) => ({
              title: `Req_details ${route.params.Requestid}`,
            })}
          />

          <Stack.Screen
            name="Garage_info"
            component={GarageInfo}
            options={({ route }) => ({
              title: `Garage_info ${route.params.iid}`,
            })}
          />

          <Stack.Screen
            name="Form"
            component={Form}
            options={({ route }) => ({
              title: `Form ${route.params.garageid}`,
            })}
          />

          {/* Wrap your Tab.Navigator in a Screen component */}
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
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

// Define the Tab Navigator separately
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home"; // Use the home icon here
          } else if (route.name === "Tasks") {
            iconName = "clipboard"; // Use the clipboard icon here
          }

          // Return the FontAwesome5 icon
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        headerShown:false
      })}
    >
      <Tab.Screen name="Home" component={CateCard} />
      <Tab.Screen name="Tasks" component={CateCard} />
    </Tab.Navigator>
  );
}

export default App;
