import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { db } from "../config/firebase";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const RequestForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [model, setModel] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [matter, setMatter] = useState("");
  const [selectedItem, setSelectedItem] = useState("Hybrid");

  const handleSave = () => {
    // Handle saving the user data here
    const requestDb = collection(db, "request");
    addDoc(requestDb, {
      username: name,
      email: email,
      status: "Pending",
    });

    router.push(`/req_details/${name}`, { Id: name });
    // You can send this data to a server, store it in state, or perform any other action.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Vehicle Model:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setModel(text)}
        value={model}
        placeholder="Enter Vehicle Model"
      />

      <Text style={styles.label}>Matter:</Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => setMatter(text)}
        value={matter}
        placeholder="Enter Vehicle Matter in Brief"
      />

      <Text style={styles.label}>Payment Method:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPayment("Cash")}
        >
          <RadioButton.Android
            value="Cash"
            status={payment === "Cash" ? "checked" : "unchecked"}
            onPress={() => setPayment("Cash")}
            color="#007AFF" // Customize the selected color
          />
          <Text>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setPayment("Card")}
        >
          <RadioButton.Android
            value="Card"
            status={payment === "Card" ? "checked" : "unchecked"}
            onPress={() => setPayment("Card")}
            color="#007AFF" // Customize the selected color
          />
          <Text>Card</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Power Source:</Text>
      <Picker
        style={styles.picker}
        selectedValue={selectedItem}
        onValueChange={(itemValue) => setSelectedItem(itemValue)}
      >
        <Picker.Item label="Hybrid" value="Hybrid" />
        <Picker.Item label="Electric" value="Electric" />
        <Picker.Item label="Fuel" value="Fuel" />
      </Picker>

      <TouchableOpacity style={styles.customButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Send Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    height: 120,
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RequestForm;
