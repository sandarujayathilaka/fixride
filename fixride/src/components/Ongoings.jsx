import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter ,router,useGlobalSearchParams} from "expo-router";
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
import { ActivityIndicator } from "react-native-paper";



const Ongoings = () => {

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState("");
  const [RequestId, setRequestId] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      const requestDb = collection(db, "request");
      const statusQuery = query(requestDb, where("mainstatus", "==", "Ongoing"));
      const querySnapshot = await getDocs(statusQuery);
      const requestData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requestData.push({ id: doc.id, ...data});
      });
      setData(requestData);
     
      
    };

    fetchData();
  }, []);
  
  const router = useRouter();


  const handleTrackStatus = (card) => {
    const { id } = card; 
    if (id) {
      setRequestId(id); 
      router.push({
        pathname: `/mngrside_status/${id}`,
        params: {
          Id: id, 
        },
      });
    } else {
      console.error("Invalid or missing RequestId");
    }
  };


  return (
    <ScrollView style={styles.container}>

    <Text style={styles.text}>Ongoing Repairs</Text>
      <Text style={styles.text2}>18 request found</Text>

     
        {data.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: "column" }}>
                 <Text style={styles.cardText}>ID: {card.reqID}</Text>
                <Text style={styles.cardText}>Name: {card.username}</Text>
                <Text style={styles.cardText}>Phone: {card.contact}</Text>
              </View>

              <View style={{ flexDirection: "column" }}>
              <Text style={styles.cardText}>
                   {new Date(card.dateTime).toLocaleDateString()}
              </Text>
          
              <Text style={styles.cardText}>
                  {new Date(card.dateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </Text>
              </View>
            </View>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.button} 
            onPress={() => handleTrackStatus(card)}>
              <Text style={styles.buttonText}>Track status</Text>
            </TouchableOpacity>
          </View>
        ))}
  
    </ScrollView>
  );
};

export default Ongoings;

const styles = StyleSheet.create({
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
  container: {
    width: "100%",
    height: "100%",
    marginTop: -30,
    marginBottom: 20,
  },
  card: {
    height: 160,
    marginTop: 20,
    backgroundColor: "#FFFDF3",
    marginHorizontal: 13,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // for Android shadow
  },
  cardText: {
    fontSize: 18,
    fontWeight:"bold",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // for Android shadow
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});