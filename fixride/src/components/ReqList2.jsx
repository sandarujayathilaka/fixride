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
    Linking
  } from "react-native";
  import { router, useGlobalSearchParams } from "expo-router";
  import React, { useEffect, useState } from 'react'
  import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
  import { db,doc } from "../config/firebase";
  import { ActivityIndicator } from "react-native-paper";
  
  
  function ReqList2(props) {
  
    const date = props.date;
    const user = props.username
  
  
     const [requestDetails,setRequest] = useState({})
     const [username, setUserName] = useState("");
     const [RequestId, setRequestId] = useState("");
     const [cTime, setCorrectTime] = useState("");
     const [cDate, setCorrectDate] = useState("");
     const [matter, setMatter] = useState("");
     const [contact, setContact] = useState("");
     const [vehicleModel, setVehicleModel] = useState("");
     const [powersource, setPowerSource] = useState("");

     const [isModalVisible, setModalVisible] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
  

     useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a Firestore query based on the provided conditions
        const requestQuery = query(
          collection(db, "request"),
        //   where("dateTime", "==", date),
        //   where("username", "==", user),
          where("status", "==", "Pending")
        );
  
        // Subscribe to real-time updates using onSnapshot
        const unsubscribe = onSnapshot(requestQuery, (snapshot) => {
          if (!snapshot.empty) {
            // If there are documents in the result, update the component state
            const doc = snapshot.docs[0];
            setRequest(doc.data());
            setRequestId(doc.id);
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
  
  



  

  
    const handleRefresh = () => {
      setRefreshing(true);
  
      // Implement your refresh logic here, for example, refetch data from Firestore
  
      // After the refresh is complete, set refreshing back to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000); // Simulate a delay (replace with your actual refresh logic)
    };

  
  
    
  
    return (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text}>Repair requests</Text>
            <TouchableOpacity style={styles.button2}>
              <Text style={styles.buttonText2}>Ongoing</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text2}>18 requests found</Text>
    
          <View style={styles.cardContainer}>
            {data.map((item, index) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.cardText}>{item.vehicleModel}</Text>
                    <Text style={styles.cardText}>{item.powerSource}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleViewDetailsClick(item.id)}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
    
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <ScrollView>
              <View>
                {requestDetails && (
                  <View>
                    <Text style={styles.requestHead}>Request</Text>
    
                    <Text style={styles.subTopic}>Contact Information</Text>
                    <View style={styles.modelCard}>
                      <Text>
                        Name:{" "}
                        <Text style={styles.subTitle}>
                          {requestDetails.username}
                        </Text>
                      </Text>
                      <Text>
                        Mobile Number:{" "}
                        <Text style={styles.subTitle}>{requestDetails.contact}</Text>
                      </Text>
                    </View>
    
                    <Text style={styles.subTopic}>Vehicle Information</Text>
                    <View style={styles.modelCard}>
                      <Text>
                        Vehicle Number:{" "}
                        <Text style={styles.subTitle}>
                          {requestDetails.vehicleNo}
                        </Text>
                      </Text>
                      <Text>
                        Vehicle Model:{" "}
                        <Text style={styles.subTitle}>
                          {requestDetails.vehicleModel}
                        </Text>
                      </Text>
                      <Text>
                        Power Source:{" "}
                        <Text style={styles.subTitle}>
                          {requestDetails.powerSource}
                        </Text>
                      </Text>
                    </View>
    
                    <Text style={styles.subTopic}>Breakdown Description</Text>
                    <View style={styles.modelCard}>
                      <Text>{requestDetails.matter}</Text>
                    </View>
    
                    <View style={{ alignItems: "center", marginTop: 13 }}>
                      <Image
                        source={{ uri: requestDetails.imageUrl }}
                        style={{ width: 370, height: 200 }} // Adjust the width and height as needed
                      />
                    </View>
    
                    <Text style={styles.subTopic}>Location</Text>
                    <Text>Map Comes Here</Text>
                  </View>
                )}
    
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.buttonText2}>Assign Mechanic</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleRejectClick(data[0])}
                  >
                    <Text style={styles.buttonText2}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>
      );
    };
    
    export default ReqList2;
    
    
    const styles = StyleSheet.create({
      container: {
        width: "100%",
        height: "100%",
        marginTop: 60,
      },
      cardTextsec: {
        fontSize: 13,
        color: "#373737",
      },
      text: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 40,
        marginLeft: 13,
      },
      text2: {
        fontSize: 15,
        marginLeft: 13,
      },
      cardContainer: {
        flexDirection: "column",
        marginTop: 20,
      },
      card: {
        height: 140,
        marginTop: 20,
        backgroundColor: "#FFFDF3",
        marginHorizontal: 13,
        borderRadius: 10,
        justifyContent: "space-between",
        padding: 10,
        borderWidth: 1,
        borderColor: "#FFAC1C",
      },
      cardText: {
        fontSize: 18,
      },
      button: {
        borderWidth: 1,
        borderColor: "#FFAC1C",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      },
    
      button2:{
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor:"#43A048"
      },
    
      buttonText: {
        fontSize: 18,
        color: "black",
        textAlign: "center",
        color: "#e89300",
      },
    
      buttonText2:{
        fontSize: 18,
        color: "black",
        textAlign: "center",
        color: "black",
      },
      cardImage: {
        width: 100,
        height: 40,
      },
    
      cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 13,
        marginRight: 13,
        marginTop: 40,
      },
    
      requestHead: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 13,
        marginRight: 13,
        marginTop: 30,
        fontSize: 24, 
        fontWeight: "bold",  
      },
    
      subTopic:{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 13,
        marginRight: 13,
        marginTop: 30,
        fontSize: 20, 
        fontWeight: "bold",  
        color: "#5A5A5A",
      },
      modelCard: {
        marginTop: 20,
        backgroundColor: "#FFFDF3",
        marginHorizontal: 13,
        borderRadius: 10,
        justifyContent: "space-between",
        padding: 10,
        borderWidth: 1,
        borderColor: "#FFAC1C",
      },
      subTitle:{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 13,
        marginRight: 13,
        marginTop: 30,
        fontSize: 15, 
        fontWeight: "bold",  
      },
    
    
      addButton: {
        backgroundColor: "#EDAE10",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        flex: 1,
        marginRight: 8,
      },
      cancelButton: {
        backgroundColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        flex: 1,
        marginLeft: 8,
      },
      buttonText2: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft:8,
        marginRight:8,
        marginTop:70,
        marginBottom:30
      },
    });