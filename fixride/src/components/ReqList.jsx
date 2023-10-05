import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";

const ReqList = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const requestDb = collection(db, "request");
      const statusQuery = query(requestDb, where("status", "==", "Pending"));
      const querySnapshot = await getDocs(statusQuery);
      const requestData = [];
      querySnapshot.forEach((doc) => {
        requestData.push({ id: doc.id, ...doc.data() });
      });
      setData(requestData);
    };

    fetchData();
  }, []);

  const handleViewDetailsClick = async (itemId) => {
    // Fetch additional details based on the itemId from the database
    const requestRef = doc(db, "request", itemId);
    const docSnap = await getDoc(requestRef);
    if (docSnap.exists()) {
      setSelectedItem(docSnap.data());
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Repair requests</Text>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText2}>Ongoings</Text>
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
              <Image source={require("./bg.png")} style={styles.cardImage} />
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

      {/* Modal to display additional details */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          {/* Display the details from selectedItem */}
          {selectedItem && (
            <View>
              <Text>Contact Information</Text>
               <Text>User Name: {selectedItem.username}</Text>
              <Text>Mobile Number: {selectedItem.contact}</Text>
             
              <Text>Vehicle Information</Text>
              <Text>Vehicle Number: {selectedItem.vehicleNo}</Text>
              <Text>Vehicle Model: {selectedItem.vehicleModel}</Text>
              <Text>Power Source: {selectedItem.powerSource}</Text>

              <Text>Breakdown Description</Text>
              <Text>Matter: {selectedItem.matter}</Text>
             
              <Text>Location</Text>
              <Text>Map Comes Here</Text>
            </View>
          )}
          
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Navigate to another screen here
                // You can use the 'navigation' prop to navigate to the desired screen
                // navigation.navigate("AnotherScreen");
              }}
            >
              <Text>Go to Another Screen</Text>
            </TouchableOpacity>
            
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ReqList;


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
    backgroundColor: "#fff4e0",
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
});
