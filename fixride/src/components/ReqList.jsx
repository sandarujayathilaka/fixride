import React, { useEffect, useState, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
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
  const router = useRouter();
  const isFocused = useIsFocused();

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState("");


  const fetchData = useCallback(async () => {
    const requestDb = collection(db, "request");
    const statusQuery = query(requestDb, where("status", "==", "Pending"));
    const querySnapshot = await getDocs(statusQuery);
    const requestData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const imageUrl = data.imageUrl;
      requestData.push({ id: doc.id, ...data, imageUrl });
    });
    setData(requestData);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const handleViewDetailsClick = async (itemId,index) => {
    const requestRef = doc(db, "request", itemId);
    const docSnap = await getDoc(requestRef);
   
    if (docSnap.exists()) {
      setSelectedItem(docSnap.data());
      setModalVisible(true);
      setSelectedItemIndex(index);
    }
  };

  const handleRejectClick = async (itemId) => {
    
    if (itemId) {
      const requestRef = doc(db, "request", itemId);

      try {
        await updateDoc(requestRef, {
          status: "Rejected",
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };



  const handleClickAssign = () => {

    if (data[selectedItemIndex].id) {
      router.push({
        pathname: `/mac-list/${data[selectedItemIndex].id}`,
        params: {
          Id: data[selectedItemIndex].id,
        },
      });
    } else {
      console.error("Invalid or missing RequestId");
    }
  };


  const handleOngoingClick = () => {
    router.push(`/ongoing-req/ongoing`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Repair requests</Text>
        <TouchableOpacity style={styles.button2}
          onPress={handleOngoingClick}>
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
              onPress={() => handleViewDetailsClick(item.id,index)}
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
            {selectedItem && (
              <View>
                <Text style={styles.requestHead}>Request</Text>

                <Text style={styles.subTopic}>Contact Information</Text>
                <View style={styles.modelCard}>
                  <Text>
                    Name:{" "}
                    <Text style={styles.subTitle}>
                      {selectedItem.username}
                    </Text>
                  </Text>
                  <Text>
                    Mobile Number:{" "}
                    <Text style={styles.subTitle}>{selectedItem.contact}</Text>
                  </Text>
                </View>

                <Text style={styles.subTopic}>Vehicle Information</Text>
                <View style={styles.modelCard}>
                  <Text>
                    Vehicle Number:{" "}
                    <Text style={styles.subTitle}>
                      {selectedItem.vehicleNo}
                    </Text>
                  </Text>
                  <Text>
                    Vehicle Model:{" "}
                    <Text style={styles.subTitle}>
                      {selectedItem.vehicleModel}
                    </Text>
                  </Text>
                  <Text>
                    Power Source:{" "}
                    <Text style={styles.subTitle}>
                      {selectedItem.powerSource}
                    </Text>
                  </Text>
                </View>

                <Text style={styles.subTopic}>Breakdown Description</Text>
                <View style={styles.modelCard}>
                  <Text>{selectedItem.matter}</Text>
                </View>

                <View style={{ alignItems: "center", marginTop: 13 }}>
                  <Image
                    source={{ uri: selectedItem.imageUrl }}
                    style={{ width: 370, height: 200 }} // Adjust the width and height as needed
                  />
                </View>

                <Text style={styles.subTopic}>Location</Text>
                <Text>Map Comes Here</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>

              <TouchableOpacity style={styles.addButton}    onPress={handleClickAssign}>
                <Text style={styles.buttonText2}>Assign Mechanic</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleRejectClick(data[selectedItemIndex].id)}
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

export default ReqList;


const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
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