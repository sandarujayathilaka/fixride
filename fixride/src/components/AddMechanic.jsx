import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../config/firebase"; // Import your Firebase database instance here

function AddMechanic({ navigation }) {
  // State variables to store mechanic details
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specializations, setSpecializations] = useState(["", ""]);

  const mechanicsCollection = collection(db, "mechanic");

  const handleAddMechanic = async () => {
    if (!name || !phoneNumber) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const newMechanic = {
        name,
        phoneNumber,
        specializations,
        availability: "available", 
      };

      const docRef = await addDoc(mechanicsCollection, newMechanic);

      console.log("Mechanic added successfully!");
      Alert.alert("Success", "Mechanic added successfully.");

      // Navigate back to the previous screen or perform any desired navigation
      // You can customize the navigation behavior here
      // navigation.goBack();
    } catch (error) {
      console.error("Error adding mechanic: ", error);
      Alert.alert("Error", "Failed to add mechanic. Please try again later.");
    }
  };


  const updateSpecialization = (index, text) => {
    const updatedSpecializations = [...specializations];
    updatedSpecializations[index] = text;
    setSpecializations(updatedSpecializations);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Mechanic</Text>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Specializations:</Text>
      <TextInput
        style={styles.input}
        placeholder="Specialization 1"
        onChangeText={(text) => updateSpecialization(0, text)}
        value={specializations[0]}
      />
      <TextInput
        style={styles.input}
        placeholder="Specialization 2"
        onChangeText={(text) => updateSpecialization(1, text)}
        value={specializations[1]}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMechanic}>
          <Text style={styles.buttonText}>Add Mechanic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FEC400",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default AddMechanic;
