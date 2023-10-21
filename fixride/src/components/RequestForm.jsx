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
import * as MediaLibrary from "expo-media-library"; 
import { Feather } from "@expo/vector-icons";// Add this line
import axios from "axios";



const RequestForm = (props) => {
  const garageId = props.garageId
  const userLatitude = props.userLatitude
  const userLongitude = props.userLongitude
  const [veheNum, setVeheNum] = useState("");
  const [model, setModel] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [matter, setMatter] = useState("");
  const [selectedItem, setSelectedItem] = useState("Hybrid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reqDate, setDateTime] = useState("");
  const [currentUser, setUser] = useState("");
   const [location, setLocation] = useState("");
useEffect(() => {
  // Get the current date and time when the component mounts
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  setDateTime(formattedDate);
  setUser("Sandaru");

  // Replace "YOUR_API_KEY" with your actual Google Maps Geocoding API key
  const apiKey = "AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE";

  // Perform reverse geocoding
  reverseGeocode(userLatitude, userLongitude, apiKey)
    .then((locationName) => {
      setLocation(locationName);
    })
    .catch((error) => {
      console.error("Error in reverse geocoding:", error);
      setLocation("Location not found");
    });
}, []);


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
            mainStatus: "Pending",
            dateTime: reqDate,
            username: currentUser,
            startStatus: "",
            reachStatus: "",
            assignStatus: "",
            doneStatus: "",
            payStatus: "Unpaid",
            payment: "Not Calculated",
            macContact: "",
            macName: "",
            garageId: garageId,
            latitude: userLatitude,
            logitude:userLongitude,
            location:location
          });
          console.log(veheNum);

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
        status: "Approved",
        dateTime: reqDate,
        mainStatus: "Pending",
        username: currentUser,
        startStatus: "",
        reachStatus: "",
        assignStatus: "",
        doneStatus: "",
        payStatus: "Unpaid",
        payment: "Not Calculated",
        macContact: "",
        macName: "",
        garageId: garageId,
        latitude: userLatitude,
        logitude: userLongitude,
        location: location,
      });
      console.log(veheNum);
      handleItemPress(veheNum);
    }
  };



  // const handleImagePicker = async () => {
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (permissionResult.granted === false) {
  //     alert("Permission to access camera roll is required!");
  //     return;
  //   }

  //   // Open the image picker with options for both camera and gallery
  //   const result = await ImagePicker.launchImageLibraryAsync();

  //   if (!result.canceled) {
  //     if (result.uri) {
  //       // Image selected from the gallery
  //       setSelectedImage(result.uri);
  //     } else if (result.assets && result.assets.length > 0) {
  //       // Image captured from the camera
  //       setSelectedImage(result.assets[0].uri);
  //     }
  //   }
  // };

  const reverseGeocode = async (latitude, longitude, apiKey) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const locationName = response.data.results[0].formatted_address;
        return locationName;
      } else {
        return "Location not found";
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "Location not found";
    }
  };

  const handleCameraCapture = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // You can enable editing if needed
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        // Save the captured image to the device's media library
        setSelectedImage(result.assets[0].uri);
      } catch (error) {
        console.error("Error saving image to media library:", error);
      }
    }
  };

  const handleItemPress = (id) => {
    router.push({
      pathname: `/req_details/${id}`,
      params: {
        Id:id,
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
      <Text style={styles.header}>Request Form</Text>

      <Text style={styles.label}>Vehicle Number:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setVeheNum(text)}
        value={veheNum}
        placeholder="Enter your Vehicle Number"
      />

      <Text style={styles.label}>Vehicle Model:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setModel(text)}
        value={model}
        placeholder="Enter Vehicle Model"
      />

      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setLocation(text)}
        value={location}
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
            color="#007AFF"
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
            color="#007AFF"
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
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleCameraCapture}
        >
          <View style={styles.iconRow}>
            <Feather name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.imagePickerText}>Attach Photo</Text>
          </View>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
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
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  input: {
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
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
    borderColor: "#CCCCCC",
    borderRadius: 5,
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: "#EDAE10",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 150,
    borderRadius: 7,
    margin: 10,
    
  },
  imagePickerButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "flex-start", // Align to the left
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center", // Center the icon vertically
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default RequestForm;
