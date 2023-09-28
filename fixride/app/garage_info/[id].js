import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
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
  const [selectedButton, setSelectedButton] = useState("Services");
  

  useEffect(() => {
    const fetchGarageData = async () => {
      try {
        const garageDocRef = doc(db, "garage", Id);
        const garageDocSnapshot = await getDoc(garageDocRef);

        if (garageDocSnapshot.exists()) {
          const data = garageDocSnapshot.data();
          setGarageData(data);
          console.log(data);
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
    <ScrollView>
      <View style={styles.container}>
        {garageData ? (
          <View>
            <View>
              <Text style={styles.topic}>{garageData.name}</Text>
            </View>

            <Text style={styles.mainText}>{garageData.username}</Text>
            <Image source={imageSource} style={styles.cardImage} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.customButton, { marginLeft: 5, flex: 1 }]}
                onPress={() => setSelectedButton("Services")} // Set the selected button state
              >
                <Text style={styles.buttonText}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customButton, { marginLeft: 5, flex: 1 }]}
                onPress={() => setSelectedButton("Contact")} // Set the selected button state
              >
                <Text style={styles.buttonText}>Contact Us</Text>
              </TouchableOpacity>
            </View>
            <View>
              {/* Conditionally render text based on the selected button */}
              {selectedButton === "Services" && <Text>{garageData.about}</Text>}
              {selectedButton === "Contact" && (
                <Text>{garageData.contact}</Text>
              )}
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
    </ScrollView>
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
    marginTop: 250,
    height: 45,
  },
  topic: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
  },
});

export default GarageInfo;
