import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../src/config/firebase";

const DisplayContent = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useGlobalSearchParams();
  const cardId = params.id;
  imageSource = require("../../assets/Picture2.png");

  useEffect(() => {
    setLoading(true);
    const usersQuery = query(
      collection(db, "garage"),
      where("category", "==", cardId)
    );
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      let usersList = [];
      snapshot.forEach((doc) => {
        usersList.push({ ...doc.data(), id: doc.id });
      });
      setGarages(usersList);
      setLoading(false);
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleItemPress = (id) => {
    router.push(`/garage_info/${id}`, { Id: id });
    console.log(`Clicked on card with ID ${id}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.mainText}>{item.name}</Text>
      <Text>
        {item.address} | Rate: {item.rating}
      </Text>
      <Image source={imageSource} style={styles.cardImage} />
      <View>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => handleItemPress(item.id)}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={styles.topic}>Near by Garages</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={garages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    height: 190,
    padding: 16,
    backgroundColor: "rgba(255, 255, 0, 0.2)", // Change the background color as needed
    borderRadius: 8,
    borderColor: "orange", // Border color
    borderWidth: 2,
  },
  customButton: {
    backgroundColor: "orange", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 25,
    height: 45,
  },
  buttonText: {
    color: "black", // Change the text color here
    fontWeight: "bold",
  },
  mainText: {
    color: "black", // Change the text color here
    fontWeight: "600",
    fontSize: 30,
  },
  cardImage: {
    width: 80,
    height: 80, // Adjust this value to control the image height
    marginLeft: 250,
    marginTop: -55,
    borderRadius: 8,
  },
  topic: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    margin:15
  },
});

export default DisplayContent;
