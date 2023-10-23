import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { db, firebase } from "../config/firebase";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

function AddMechanic() {
  const router = useRouter();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specializations, setSpecializations] = useState(["", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mechanicsCollection = collection(db, "mechanic");
  const availability = "available";

  const isPhoneNumberUnique = async (phoneNumber) => {
    const q = query(
      mechanicsCollection,
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  // const handleAddMechanic = async () => {
  //   if (!name || !phoneNumber) {
  //     Alert.alert('Error', 'Please fill out all fields');
  //     return;
  //   }

  //   if (phoneNumber.length !== 10) {
  //     Alert.alert('Error', 'Phone number must be 10 digits');
  //     return;
  //   }

  //   try {
  //     const isUnique = await isPhoneNumberUnique(phoneNumber);

  //     if (!isUnique) {
  //       Alert.alert('Error', 'Phone number is already in use.Please give an other phone number');
  //       return;
  //     }

  //     const newMechanic = {
  //       name,
  //       phoneNumber,
  //       specializations,
  //       availability: 'available',
  //       email,
  //       password,
  //     };

  //     const docRef = await addDoc(mechanicsCollection, newMechanic);

  //     console.log('Mechanic added successfully!');
  //     Alert.alert('Success', 'Mechanic added successfully.');

  //   setName('');
  //   setPhoneNumber('');
  //   setSpecializations(['', '']);

  //   } catch (error) {
  //     console.error('Error adding mechanic: ', error);
  //     Alert.alert('Error', 'Failed to add mechanic. Please try again later.');
  //   }
  // };

  registerUser = async (
    email,
    password,
    name,
    phoneNumber,
    specializations,
    availability
  ) => {
    if (!name || !phoneNumber) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return;
    }
    const isUnique = await isPhoneNumberUnique(phoneNumber);
    if (!isUnique) {
      Alert.alert(
        "Error",
        "Phone number is already in use.Please give an other phone number"
      );
      return;
    }
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: "https://fixride-50426.firebaseapp.com",
          })
          .then(() => {
            alert("Verification email sent");
          })
          .catch((error) => {
            alert(error.message);
          })
          .then(() => {
            firebase
              .firestore()
              .collection("mechanic")
              .doc(firebase.auth().currentUser.uid)
              .set({
                name,
                phoneNumber,
                specializations,
                availability,
                email,
                userType: "Mechanic",
              });
            Alert.alert("Success", "Mechanic added successfully.");

            setName("");
            setPhoneNumber("");
            setSpecializations(["", ""]);
            setEmail("");
            setPassword("");
          })
          .catch((error) => {
            alert(error.message);
          });
      })

      .catch((error) => {
        alert(error.message);
      });
  };

  const handleCancel = () => {
    navigation.navigate("GarageMngrDash");
  };

  const updateSpecialization = (index, text) => {
    const updatedSpecializations = [...specializations];
    updatedSpecializations[index] = text;
    setSpecializations(updatedSpecializations);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Add New Mechanic</Text>
        <Image
          source={require("../../assets/newMechanic.png")}
          style={styles.logo}
        />
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Enter mechanic name"
        />

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          keyboardType="numeric"
          placeholder="Enter mechanic contatct number"
        />

        <Text style={styles.label}>Skills:</Text>
        <TextInput
          style={styles.input}
          placeholder="Most skilled area "
          onChangeText={(text) => updateSpecialization(0, text)}
          value={specializations[0]}
        />
        {/* <TextInput
        style={styles.input}
        placeholder="Most skilled area 2"
        onChangeText={(text) => updateSpecialization(1, text)}
        value={specializations[1]}
      /> */}

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter mechanic email"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Enter mechanic password"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              registerUser(
                email,
                password,
                name,
                phoneNumber,
                specializations,
                availability
              )
            }
          >
            <Text style={styles.buttonText}>Add Mechanic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
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
  logo: {
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 70,
    width: 200,
    height: 200,
  },
});

export default AddMechanic;
