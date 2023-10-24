import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Modal,
  Button,
  Linking,
} from "react-native";

import { router, useGlobalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db, doc } from "../../config/firebase";

import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

export default function CancelledDetails(props) {
  const navigation = useNavigation();

  const date = props.date;

  const user = props.username;

  const [requestDetails, setRequest] = useState({});

  const [loading, setLoading] = useState(false);

  const [RequestId, setRequestId] = useState("");

  const [cTime, setCorrectTime] = useState("");

  const [garageName, setGarageName] = useState("");

  const [garageMobile, setGarageMobile] = useState("");

  const [cDate, setCorrectDate] = useState("");

  const [showBusyMessage, setShowBusyMessage] = useState(false);

  const [messages, setMessages] = useState([
    "Waiting for approval ...",

    "Garage seems busy ...",

    "Please Wait 2-3 Minutes ...",

    "Thanks for Your Patience ...",

    // Add more messages here
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const [isModalVisible, setModalVisible] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const imageSource = require("../../../assets/men.png");

  const gifimage = require("../../../assets/garage.gif");

  const callImage = require("../../../assets/call.png");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a Firestore query based on the provided conditions

        const requestQuery = query(
          collection(db, "request"),

          where("dateTime", "==", date),

          where("username", "==", user)
        );

        // Subscribe to real-time updates using onSnapshot

        const unsubscribe = onSnapshot(requestQuery, (snapshot) => {
          if (!snapshot.empty) {
            // If there are documents in the result, update the component state

            const doc = snapshot.docs[0];

            setRequest(doc.data());

            setRequestId(doc.id);

            const garageQuery = query(
              collection(db, "garage"),

              where("garageId", "==", doc.data().garageId)
            );

            const unsubscrib = onSnapshot(garageQuery, (snapshot) => {
              if (!snapshot.empty) {
                // If there are documents in the result, update the component state

                const doc1 = snapshot.docs[0];

                console.log(doc1.data());

                setGarageName(doc1.data().name);

                setGarageMobile(doc1.data().contact);
              }
            });
          }

          setLoading(false);
        });

        return () => unsubscribe(); // Unsubscribe when the component unmounts
      } catch (error) {
        console.error("Error retrieving documents: ", error);

        setLoading(false);
      }
    };

    fetchData();
  }, []); // Add date and user to the dependency array

  useEffect(() => {
    const correctDateTime = async () => {
      if (date) {
        // Check if date is defined

        const timestamp = date;

        const dateTime = new Date(timestamp);

        const correctDate = dateTime.toDateString();

        const correctTime = dateTime.toLocaleTimeString();

        setCorrectDate(correctDate);

        setCorrectTime(correctTime);

        console.log("Date:", correctDate);

        console.log("Time:", correctTime);
      }
    };

    correctDateTime();
  }, []);

  useEffect(() => {
    // Use a timeout to change the displayed message every 10 seconds

    const timeoutId = setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // 10000 milliseconds = 10 seconds

    return () => {
      clearTimeout(timeoutId);
    }; // Cleanup the timeout when the component unmounts
  }, [messages, currentMessageIndex]);

  const handleOKPress = async () => {
    // Close the modal

    setModalVisible(false);

    // Redirect to the home page (you should replace '/home' with your actual home page route)

    //router.push(`/cat_list/All`, { cardId: 'All' });

    navigation.navigate("CatList", { cardid: "All" });

    // Update the request status to "Busy" in Firestore
  };

  const handleTrackStatus = () => {
    if (RequestId) {
      // router.push({

      //   pathname: `/status/${RequestId}`,

      //   params: {

      //     Id: RequestId,

      //   },

      // });

      navigation.navigate("Status", { Requestid: RequestId });
    } else {
      console.error("Invalid or missing RequestId");
    }
  };

  const handlePayment = () => {
    if (RequestId) {
      console.log("hhhhh", RequestId);

      // router.push({

      //   pathname: `/payment/${RequestId}`,

      //   params: {

      //     Id: RequestId,

      //   },

      // });

      navigation.navigate("Payment", { Requestid: RequestId });
    } else {
      console.error("Invalid or missing RequestId");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);

    // Implement your refresh logic here, for example, refetch data from Firestore

    // After the refresh is complete, set refreshing back to false

    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a delay (replace with your actual refresh logic)
  };

  const handleContactUs = () => {
    if (requestDetails && requestDetails.macContact) {
      const phoneNumber = requestDetails.macContact;

      const url = `tel:${phoneNumber}`;

      // Open the phone dialer with the provided phone number

      Linking.openURL(url)

        .then(() => {
          console.log(`Calling ${phoneNumber}`);
        })

        .catch((error) => {
          console.error("Error opening phone dialer:", error);
        });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />

            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.topic}>Activity Details</Text>

            <View style={styles.serviceColumn}>
              <View>
                <Text style={styles.mainLable}>{garageName}</Text>

                <Text style={{ fontSize: 16 }}>{garageMobile}</Text>
              </View>

              <View style={styles.datetime}>
                <Text style={{ fontSize: 16 }}>{cDate}</Text>

                <Text
                  style={{ textAlign: "right", fontSize: 16, marginTop: 5 }}
                >
                  {cTime}
                </Text>
              </View>
            </View>

            <View
              style={{
                borderBottomColor: "black",

                borderBottomWidth: StyleSheet.hairlineWidth,

                marginTop: 10,
              }}
            />

            <View style={styles.serviceColumn}>
              <View>
                <Text
                  style={[
                    styles.mainLable,
                    { marginTop: 10, textAlign: "center" },
                  ]}
                >
                  {requestDetails.mainStatus}
                </Text>
              </View>
            </View>

            <View
              style={{
                borderBottomColor: "black",

                borderBottomWidth: StyleSheet.hairlineWidth,

                marginTop: 10,
              }}
            />

            <View
              style={{
                backgroundColor: "white",

                marginTop: 10,

                borderRadius: 10,

                shadowColor: "black",

                shadowOffset: {
                  width: 0,

                  height: 3,
                },

                shadowOpacity: 0.8,

                shadowRadius: 4,

                elevation: 6, // For Android shadow

                marginTop: 15,

                marginBottom: 10,
              }}
            >
              <View style={styles.serviceColumn}>
                <View style={{ margin: 20 }}>
                  <Text style={styles.mainLable}>
                    Garage is busy now. Try another garage.
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                borderBottomColor: "black",

                borderBottomWidth: StyleSheet.hairlineWidth,

                marginTop: 10,
              }}
            />

            <View>
              <View style={[styles.row, { marginTop: 20 }]}>
                <Text style={styles.label}>Vehicle No</Text>

                <Text style={styles.detail}>{requestDetails.vehicleNo}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Power Source</Text>

                <Text style={styles.detail}>{requestDetails.powerSource}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Breakdown Location</Text>

                <Text style={styles.detail}>Matara</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Vehicle Model</Text>

                <Text style={styles.detail}>{requestDetails.vehicleModel}</Text>
              </View>
            </View>

            <View
              style={{
                borderBottomColor: "black",

                borderBottomWidth: StyleSheet.hairlineWidth,

                marginTop: 10,
              }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,

    backgroundColor: "white",

    height: "100%",
  },

  topic: {
    textAlign: "center",

    fontWeight: "bold",

    marginBottom: 60,

    marginTop: 30,

    fontSize: 15,
  },

  mainLable: {
    fontSize: 18,

    fontWeight: "bold",

    marginBottom: 5,
  },

  serviceColumn: {
    flexDirection: "row",
  },

  datetime: {
    marginLeft: "auto",
  },

  input: {
    height: 50,

    borderColor: "gray",

    borderWidth: 1,

    marginBottom: 20,

    paddingHorizontal: 10,

    marginVertical: 5,

    borderRadius: 100,
  },

  customButton: {
    backgroundColor: "orange", // Change the button color here

    padding: 10,

    borderRadius: 5,

    alignItems: "center",
  },

  buttonText: {
    color: "white", // Change the text color here

    fontWeight: "bold",
  },

  cardImage: {
    width: 150,

    height: 150,

    marginRight: 10,

    marginTop: 0,

    borderRadius: 8,
  },

  row: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 10,
  },

  label: {
    fontWeight: "bold",

    marginRight: 10,
  },

  detail: {
    flex: 1,

    textAlign: "right",
  },

  payButton: {
    backgroundColor: "orange",

    padding: 10,

    borderRadius: 5,

    alignItems: "center",

    marginTop: 10,

    height: 45,
  },

  loadingContainer: {
    backgroundColor: "white",
  },

  containerImage: {
    flex: 1,

    justifyContent: "center", // Center vertically

    alignItems: "center",

    marginTop: 100, // Center horizontally
  },

  waitingImage: {
    width: 425, // Set the desired width

    height: 425,
  },

  modalContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",

    padding: 20,

    borderRadius: 10,

    width: "80%",

    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,

    fontWeight: "bold",

    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,

    marginBottom: 20,

    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "orange",

    padding: 10,

    borderRadius: 5,

    width: "50%",

    alignItems: "center",
  },

  modalButtonText: {
    color: "white",

    fontWeight: "bold",
  },

  messageText: {
    fontSize: 20,

    fontWeight: "bold",

    textAlign: "center",

    marginVertical: 20,

    color: "black", // Change the color to your liking
  },

  trackStatusButton: {
    backgroundColor: "black", // Button background color

    padding: 10,

    borderRadius: 5,

    alignItems: "center",

    marginTop: 5, // Adjust the margin as needed

    // Add any other button styles here
  },

  trackStatusButtonText: {
    color: "white",

    fontWeight: "bold",
  },

  unpaidStatus: {
    color: "red",

    fontWeight: "500", // Change to your desired color for unpaid status
  },

  paidStatus: {
    color: "green",

    fontWeight: "500", // Change to your desired color for paid status
  },

  callImage: {
    width: 60,

    height: 60,

    marginTop: 10,

    marginLeft: 50,
  },
});
