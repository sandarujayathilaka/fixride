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
import * as Location from "expo-location";

const DisplayContent = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const MAX_DISTANCE_KM = 10;

  const params = useGlobalSearchParams();
  const cardId = params.id;
  imageSource = require("../../assets/Picture2.png");

  useEffect(() => {
    setLoading(true);

    // Fetch user location if it's null
    if (!userLocation) {
      getUserLocation();
    } else {
      // User location is available, fetch nearby garages
      const usersQuery = query(
        collection(db, "garage"),
        where("category", "==", cardId)
      );
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        let usersList = [];

        snapshot.forEach((doc) => {
          const garageData = doc.data();
          const garageLocation = {
            latitude: garageData.latitude,
            longitude: garageData.longitude,
          };

          if (userLocation) {
            const distance = calculateDistance(userLocation, garageLocation);

            if (distance <= MAX_DISTANCE_KM) {
              usersList.push({ ...garageData, id: doc.id });
            }
          }
        });

        setGarages(usersList);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userLocation, cardId]);

  const handleItemPress = (id) => {
    router.push(`/garage_info/${id}`, { Id: id });
  };

  const getUserLocation = async () => {
    console.log("Called getUserLocation");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status !== "granted") {
        console.error("Location permission denied.");
        return;
      }

      console.log("Before location retrieval");
      const location = await Location.getCurrentPositionAsync({});
      console.log("After location retrieval");
      console.log("Location data:", location);

      const userLocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userLocationData);
      console.log("User location:", userLocationData);
    } catch (error) {
      console.error("Error getting user location: ", error);
    }
  };

  const calculateDistance = (location1, location2) => {
    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const lat1 = toRadians(location1.latitude);
    const lon1 = toRadians(location1.longitude);
    const lat2 = toRadians(location2.latitude);
    const lon2 = toRadians(location2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance;
  };

  const renderItem = ({ item }) => {
    // Assuming 'closedTime' is in the format 'hh.mm'
    const [closedHour, closedMinute] = item.closedTime.split(".").map(Number);

    // Get the current time
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    // Convert both times to minutes for easier comparison
    const closedTimeInMinutes = closedHour * 60 + closedMinute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Determine if the garage is closed based on the comparison
    const isClosed = currentTimeInMinutes >= closedTimeInMinutes;

    return (
      <TouchableOpacity onPress={() => handleItemPress(item.id)}>
        <View style={styles.card}>
          <Text style={styles.mainText}>{item.name}</Text>
          <Text>
            {item.address} | Rate: {item.rating}
          </Text>
          <Text>
           Status:{" "}
            {isClosed ? "Closed" : "Opened"}
          </Text>
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.topic}>Nearby Garages</Text>
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
    margin: 15,
  },
});

export default DisplayContent;
