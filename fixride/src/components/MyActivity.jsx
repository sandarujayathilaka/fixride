import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db } from "../config/firebase";
import { useToast } from "react-native-toast-message";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();
import StarRating from 'react-native-star-rating';

const MyActivity = () => {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
    fetchData(status);
  }, [status]);

  const onSearch = () => {
    // Fetch data based on the searchTerm
    fetchData(status, searchTerm);
  };

  
  const fetchData = async (selectedStatus, search = "") => {
    const activityDb = collection(db, "request");
    let q = query(activityDb, where("mainstatus", "==", selectedStatus));
 
    if (search) {
        q = query(q, where("mainstatus", "==", search)); // Replace "yourFieldToSearch" with the actual field name to search
      }

    try {
      const querySnapshot = await getDocs(q);
      const activityData = [];
      querySnapshot.forEach((doc) => {
        const { status } = doc.data();
        activityData.push({
          id: doc.id,
          status,
        });
      });
      setData(activityData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 

  return (
   
<>
      <View style={styles.container}>
        <Text style={styles.label}>My Activity</Text>
        <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        onSubmitEditing={onSearch}
      />
        
      </View>

      
<Tab.Navigator>
        <Tab.Screen
          name="Ongoing"
          
        />
        <Tab.Screen
          name="Completed"
          
        />
        <Tab.Screen
          name="Cancelled"
          
        />
      </Tab.Navigator>
      
    </>
  
  );
};




const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  activityItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default MyActivity;
