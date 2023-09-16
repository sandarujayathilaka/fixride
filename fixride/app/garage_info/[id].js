import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

const GarageInfo = () => {
  const [garageData, setGarageData] = useState(null);
  const params = useGlobalSearchParams();
  const Id = params.id;
  const imageSource = require("../../assets/Picture2.png");

  // State to track which button was clicked
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        const garageDocRef = doc(db, "garage", Id);
        const garageDocSnapshot = await getDoc(garageDocRef);

        if (garageDocSnapshot.exists()) {
          const data = garageDocSnapshot.data();
          setGarageData(data);
        } else {
          setGarageData(null);
        }
      } catch (error) {
        console.error("Error fetching garage data:", error);
      }
    };

    fetchGarageData();
  }, [Id]);

  const handleRequestMechanic = (id) => {
    router.push(`/form/${id}`, { Id: id });
    console.log(`Clicked on card with ID ${id}`);
  };

  return (
    <View style={styles.container}>
      <Text>Garage Info</Text>
      {garageData ? (
        <View>
          <Text style={styles.mainText}>{garageData.username}</Text>
          <Image source={imageSource} style={styles.cardImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.customButton, { marginLeft: 5, flex: 1 }]}
              onPress={() => setSelectedButton("Sandaru")} // Set the selected button state
            >
              <Text style={styles.buttonText}>Sandaru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.customButton, { marginLeft: 5, flex: 1 }]}
              onPress={() => setSelectedButton("Primal")} // Set the selected button state
            >
              <Text style={styles.buttonText}>Primal</Text>
            </TouchableOpacity>
          </View>
          <View>
            {/* Conditionally render text based on the selected button */}
            {selectedButton === "Sandaru" && <Text>{garageData.about}</Text>}
            {selectedButton === "Primal" && <Text>{garageData.contact}</Text>}
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <View>
        <TouchableOpacity
          style={styles.macButton}
          onPress={() => handleRequestMechanic()}
        >
          <Text>Request a Machenic</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  customButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 25,
    height: 45,
    flex: 1, // Expand button width equally
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  mainText: {
    color: "black",
    fontWeight: "600",
    fontSize: 30,
    marginLeft: 10,
  },
  cardImage: {
    width: 150,
    height: 150,
    marginLeft: 120,
    marginTop: 45,
    borderRadius: 8,
  },
  macButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 325,
    height: 45,
  },
});

export default GarageInfo;
