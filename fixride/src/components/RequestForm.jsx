import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { db } from "../config/firebase";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const RequestForm = () => {
  const [veheNum, setVeheNum] = useState("");
  const [model, setModel] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [matter, setMatter] = useState("");
  const [selectedItem, setSelectedItem] = useState("Hybrid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reqDate, setDateTime] = useState("");
  const [currentUser, setUser] = useState("");

  useEffect(() => {
    // Get the current date and time when the component mounts
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    setDateTime(formattedDate);
    setUser("Sandaru")
  }, []); //

  const handleSave = async () => {
    const requestDb = collection(db, "request");

    // Check if an image is selected
    if (selectedImage) {
      try {
        // Convert the selected image to a base64 encoded string
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = reader.result.split(",")[1]; // Extract the base64 string

          // Add the data to Firestore
          await addDoc(requestDb, {
            vehicleNo: veheNum,
            vehicleModel: model,
            matter: matter,
            paymentMethod: payment,
            powerSource: selectedItem,
            imageUrl: `data:image/jpeg;base64,${base64data}`, // Store as base64 URL
            status: "Pending",
            mainstatus: "Ongoing",
            dateTime: reqDate,
            username: currentUser,
          });
          console.log(veheNum)

          handleItemPress(veheNum);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    } else {
      // No image selected, add other data to Firestore
      await addDoc(requestDb, {
        vehicleNo: veheNum,
        vehicleModel: model,
        matter: matter,
        paymentMethod: payment,
        powerSource: selectedItem,
        status: "Pending",
        dateTime: reqDate,
        mainstatus: "Ongoing",
        username: currentUser,
      });
        console.log(veheNum);
     handleItemPress(veheNum);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

   const handleItemPress = (id) => {
     router.push({
       pathname: `/req_details/${id}`,
       params: {
         date: reqDate,
         Num: veheNum,
         vehemodel: model,
         paymentmethod: payment,
         vehematter: matter,
         power: selectedItem,
         user: currentUser,
       },
     }); //when need to pass multiple value with link use this method
     console.log(`Clicked with form ${id}`);
   };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Vehicle No:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setVeheNum(text)}
        value={veheNum}
        placeholder="Enter your Vehicle No"
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

      <View style={styles.imageContainer}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePicker}
        >
          <Text style={styles.imagePickerText}>Select an Image</Text>
        </TouchableOpacity>
      </View>

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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular if desired
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "left",
  },
  imagePickerText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RequestForm;
