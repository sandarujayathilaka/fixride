import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../config/firebase";
import { router } from "expo-router";

const RequestForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male"); // Default gender

  const handleSave = () => {
    // Handle saving the user data here
    const requestDb = collection(db, "request");
    addDoc(requestDb, {
      username: name,
      email: email,
      status: "Pending",
    });

     router.push(`/status/${name}`, { Id:name });
    // You can send this data to a server, store it in state, or perform any other action.
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <View>
          <TouchableOpacity style={styles.customButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 100,
  },
  customButton: {
    backgroundColor: "orange", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white", // Change the text color here
    fontWeight: "bold",
  },
});

export default RequestForm;
