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
  Button
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db,doc } from "../config/firebase";
import { ActivityIndicator } from "react-native-paper";


export default function RequestDetails(props) {

  const date = props.date;
  const user = props.username


   const[requestDetails,setRequest] = useState({})
   const [loading, setLoading] = useState(false);
   const [RequestId, setRequestId] = useState("");
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
    const [isModalVisible, setModalVisible] = useState(true);

   
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
             setRequestId(doc.id)
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
   }, []);

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
   }, 10000); // 10000 milliseconds = 10 seconds

   return () => {
     clearTimeout(timeoutId);
   }; // Cleanup the timeout when the component unmounts
 }, [messages, currentMessageIndex]);

const handleOKPress = async () => {
  
  // Close the modal
  setModalVisible(false);

  // Redirect to the home page (you should replace '/home' with your actual home page route)
  router.push(`/cat_list/All`, { cardId: 'All' });

  // Update the request status to "Busy" in Firestore
  
};

  const handleTrackStatus = () => {
    if (RequestId) {
      router.push({
        pathname: `/status/${RequestId}`,
        params: {
          Id: RequestId,
        },
      });
    } else {
      console.error("Invalid or missing RequestId");
    }
  };

  

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
        ) : requestDetails.status === "Reject" ? (
          // Display the modal when the request is rejected
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Garage is Busy</Text>
                  <Text style={styles.modalMessage}>
                    Sorry, the garage is currently busy and cannot accept your
                    request at the moment.
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleOKPress}
                  >
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
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
                  onPress={handleTrackStatus}
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
    backgroundColor: "white",
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
  loadingContainer: {
    backgroundColor: "white",
  },
  waitingImage: {
    width: "100%",
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
});