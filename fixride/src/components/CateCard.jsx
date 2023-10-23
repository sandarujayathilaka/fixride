import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../src/config/firebase";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const homeLogo = require("../../assets/homelogo.jpg");
const cardData = [
  // {
  //   id: "Car",
  //   title: "Car",
  //   imageSource: require("../../assets/RedCar.png"), // Replace with your image path
  // },
  // {
  //   id: "ThreeWeel",
  //   title: "Tuk-Tuk",
  //   imageSource: require("../../assets/tuktuk.png"), // Replace with your image path
  // },
  {
    id: "Bicycle",
    title: "Bike",
    imageSource: require("../../assets/bike.png"), // Replace with your image path
  },
  {
    id: "Truck",
    title: "Truck",
    imageSource: require("../../assets/truck.png"), // Replace with your image path
  },
  {
    id: "Bus",
    title: "Bus",
    imageSource: require("../../assets/bus.png"), // Replace with your image path
  },
  {
    id: "All",
    title: "Any",
    imageSource: require("../../assets/All.png"), // Replace with your image path
  },
];

function CateCard() {
  const [userData, setUserData] = useState({});
  const [timeGreeting, setTimeGreeting] = useState("");
  const userEmail = "deno@gmail.com"; // Replace with the user's email

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a Firestore query based on the provided conditions
        const requestQuery = query(
          collection(db, "users"),
          where("email", "==", userEmail)
        );

        // Subscribe to real-time updates using onSnapshot
        const unsubscribe = onSnapshot(requestQuery, (snapshot) => {
          if (!snapshot.empty) {
            // If there are documents in the result, update the component state
            const doc = snapshot.docs[0];
            setUserData(doc.data()); // Set userData with the document data
            console.log(doc.data()); // Log the data for debugging
          }
        });

        return () => unsubscribe(); // Unsubscribe when the component unmounts
      } catch (error) {
        console.error("Error retrieving documents: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array, as it's only supposed to run once

  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  useEffect(() => {
    const greeting = getTimeBasedGreeting();
    setTimeGreeting(greeting);
  }, []);

  const handleCardClick = (id) => {
    // Handle card click here, e.g., navigate to a new screen or perform an action.
    router.push(`/cat_list/${id}`, { cardId: id });
    console.log(`Clicked on card with ID ${id}`);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={homeLogo} style={styles.logocardImage} />
        <Text style={styles.greetingText}>Hi, {userData.firstname}</Text>
        <Text style={styles.timeGreetingText}>{timeGreeting} ...</Text>
      </View>
      <View style={styles.gridContainer}>
        {cardData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCardClick(item.id)}
            style={styles.gridItem}
          >
            <Image source={item.imageSource} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F8", // Light blue background color
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E7B10A", // Yellow background color
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  logocardImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 0,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF", // White text color
    marginTop: 10,
  },
  timeGreetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF", // White text color
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  gridItem: {
    flexBasis: "48%",
    backgroundColor: "#FFFFFF", // White background color
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FEC400", // Yellow border color
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  cardTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333", // Dark text color
  },
});

export default CateCard;
