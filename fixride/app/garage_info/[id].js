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
  const [selectedButton, setSelectedButton] = useState("Services");
  const params = useGlobalSearchParams();
  const Id = params.id;
  const imageSource = require("../../assets/Picture2.png");

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
    <ScrollView contentContainerStyle={styles.container}>
      {garageData ? (
        <View>
          <Text style={styles.topic}>{garageData.name}</Text>
          <Text style={styles.mainText}>{garageData.username}</Text>
          <Image source={imageSource} style={styles.cardImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.customButton,
                selectedButton === "Services" && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton("Services")}
            >
              <Text style={styles.buttonText}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.customButton,
                selectedButton === "Contact" && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton("Contact")}
            >
              <Text style={styles.buttonText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          <View>
            {selectedButton === "Services" && <Text>{garageData.about}</Text>}
            {selectedButton === "Contact" && <Text>{garageData.contact}</Text>}
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <TouchableOpacity
        style={styles.macButton}
        onPress={() => handleRequestMechanic()}
      >
        <Text style={styles.buttonText}>Request a Mechanic</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  customButton: {
    flex: 1,
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    margin:2
  },
  selectedButton: {
    backgroundColor: "brown", 
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  mainText: {
    color: "black",
    fontWeight: "600",
    fontSize: 24,
    marginVertical: 10,
  },
  cardImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 20,
    
  },
  macButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  topic: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
  },
});

export default GarageInfo;
