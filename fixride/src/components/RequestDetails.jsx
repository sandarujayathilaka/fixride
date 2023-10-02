import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { ActivityIndicator } from "react-native-paper";


export default function RequestDetails(props) {

  const date = props.date;
  const user = props.username


   const[requestDetails,setRequest] = useState({})
   const [loading, setLoading] = useState(false);
   const [cTime, setCorrectTime] = useState("");
   const [cDate, setCorrectDate] = useState("");
  const [showBusyMessage, setShowBusyMessage] = useState(false);
   const [messages, setMessages] = useState([
     "Waiting for approval...",
     "Garage seems busy",
     "You can use below button to choose another garage",
     // Add more messages here
   ]);
   const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

   
 const imageSource = require("../../assets/Picture2.png");
 const gifimage = require("../../assets/wait.jpg");



   useEffect(() => {
     const fetchData = async () => {
       try {
         const requestQuery = query(
           collection(db, "request"),
           where("dateTime", "==", date),
           where("username", "==", user)
         );

         const unsubscribe = onSnapshot(requestQuery, (snapshot) => {
           if (!snapshot.empty) {
             const doc = snapshot.docs[0];
             setRequest(doc.data());
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
   }, [date, user]);

 useEffect(() => {

   const correctDateTime = async () => {

    const timestamp = date;

    const dateTime = new Date(timestamp);

    const correctDate = dateTime.toDateString(); // Extracts the date portion
    const correctTime = dateTime.toLocaleTimeString(); // Extracts the time portion

    setCorrectDate(correctDate)
    setCorrectTime(correctTime)

    console.log("Date:", correctDate); // Output: Date: Sun Oct 02 2023
    console.log("Time:", correctTime);
     
   };

   correctDateTime();
 }, [date, user]);

 useEffect(() => {
   // Use a timeout to change the displayed message every 10 seconds
   const timeoutId = setTimeout(() => {
     setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
   }, 10000); // 10000 milliseconds = 10 seconds

   return () => {
     clearTimeout(timeoutId);
   }; // Cleanup the timeout when the component unmounts
 }, [messages, currentMessageIndex]);

console.log(requestDetails.status)
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text>Loading...</Text>
          </View>
        ) : requestDetails.status === "Pending" ? (
          // Display the current message based on the currentMessageIndex
          <View>
            <Text>{messages[currentMessageIndex]}</Text>
            <Image source={gifimage} style={styles.waitingImage} />
          </View>
        ) : (
          <>
            <Text style={styles.topic}>Activity Details</Text>
            <View style={styles.serviceColumn}>
              <View>
                <Text style={styles.mainLable}>ddk</Text>
                <Text style={{ fontSize: 16 }}>0774333450</Text>
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
                <Text style={styles.mainLable}>
                  {requestDetails.mainstatus}
                </Text>
              </View>
              <View style={styles.datetime}>
                <Text style={{ fontSize: 16 }}>{requestDetails.status}</Text>
                <TouchableOpacity
                  style={{ textAlign: "right", fontSize: 16, marginTop: 5 }}
                >
                  <Text>Track Status</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 10,
              }}
            />
            <View style={{ backgroundColor: "yellow", marginTop: 10 }}>
              <View style={styles.serviceColumn}>
                <View style={{ margin: 10 }}>
                  <Text style={styles.mainLable}>Mechanic Details</Text>
                  <TouchableOpacity style={{ fontSize: 16, marginTop: 5 }}>
                    <Text>Live Track</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16 }}>Vehicle NO :</Text>
                  <Text style={{ fontSize: 16 }}>
                    {requestDetails.vehecleNo}
                  </Text>
                </View>
                <View style={styles.datetime}>
                  <Image source={imageSource} style={styles.cardImage} />
                  <Text
                    style={{ fontSize: 16, textAlign: "right", margin: 15 }}
                  >
                    Mechanic Name
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
              <View style={styles.row}>
                <Text style={styles.label}>Matter :</Text>
                <Text style={styles.detail}>{requestDetails.matter}</Text>
              </View>
              <View style={styles.row}>
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
              <View style={styles.row}>
                <Text style={styles.label}>Selected Payment method</Text>
                <Text style={styles.detail}>
                  {requestDetails.paymentMethod}
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

            <View>
              <View style={styles.row}>
                <Text style={styles.label}>Service Fee</Text>
                <Text style={styles.detail}>Rs.5000.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.detail}>Unpaid</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.payButton}>
                <Text>Card Payment</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor:'white'
  },
  topic: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 0,
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
    marginTop: 40,
    height: 45,
  },
  loadingContainer:{
    backgroundColor:'white'
  },
  waitingImage:{
    width:'100%',
  }
});