import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Modal,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { collection,where, getDocs, query } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { Feather } from "@expo/vector-icons";// Add this line

const GarageInfo = () => {
  const [garageData, setGarageData] = useState(null);
  const [selectedButton, setSelectedButton] = useState("Services");
  const [isGarageClosed, setIsGarageClosed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [garageClosingTime, setGarageClosingTime] = useState("");


  const params = useGlobalSearchParams();
  const Id = params.id;
  const userLatitude = params.userLatitude
  const userLongitude =params.userLongitude
  console.log("called",Id)
  const imageSource = require("../../assets/logo.webp");

  const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchGarageData = async () => {
     try {
       // Create a reference to the "garage" collection
       const garageCollectionRef = collection(db, "garage");
console.log(garageCollectionRef);
       // Create a query to filter documents based on the garageId field
       const garageQuery = query(
         garageCollectionRef,
         where("garageId", "==", Id)
       );

       // Fetch documents that match the query
       const querySnapshot = await getDocs(garageQuery);

       if (!querySnapshot.empty) {
         // Get the first document from the result set (assuming garageId is unique)
         const doc = querySnapshot.docs[0];
         const data = doc.data();
         setGarageData(data);
         setLoading(false);

         // Check if the garage is closed
         const currentTime = new Date();
         const closedTimeParts = data.closedTime.split("."); // Split "17.30" into ["17", "30"]
         const closedHour = parseInt(closedTimeParts[0], 10);
         const closedMinute = parseInt(closedTimeParts[1], 10);

         // Set the garage's closing time based on the date of the current time
         const garageClosingTime = new Date(
           currentTime.getFullYear(),
           currentTime.getMonth(),
           currentTime.getDate(),
           closedHour,
           closedMinute
         );

         if (currentTime > garageClosingTime) {
           setIsGarageClosed(true);
           setGarageClosingTime(""); // Clear the garageClosingTime state
         } else {
           setIsGarageClosed(false);
           setGarageClosingTime(data.closedTime); // Set the garageClosingTime state
         }
       } else {
         // Handle the case when the garage document does not exist
         setGarageData(null);
         setLoading(false);
       }
     } catch (error) {
       console.error("Error fetching garage data:", error);
       setLoading(false);
     }
   };

   fetchGarageData();
 }, [Id]);


 const handleRequestMechanic = (id) => {
   if (isGarageClosed) {
     // Show the modal if the garage is closed
     toggleModal();
   } else {
     router.push({
       pathname: `/form/${id}`,
       params: {
         Id: id,
         userLatitude: userLatitude,
         userLongitude: userLongitude,
       },
     });
   }
 };

  const handleContactUs = () => {
    if (garageData && garageData.contact) {
      const phoneNumber = garageData.contact;
      const url = `tel:${phoneNumber}`;

      // Open the phone dialer with the provided phone number
      Linking.openURL(url)
        .then(() => {
          console.log(`Calling ${phoneNumber}`);
        })
        .catch((error) => {
          console.error("Error opening phone dialer:", error);
        });
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="orange" />
        ) : garageData ? (
          <View>
            <View style={styles.imageContainer}>
              <Image source={imageSource} style={styles.cardImage} />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.topic}>{garageData.name}</Text>
              <Text style={styles.rating}>
                <Feather name="star" size={20} color="orange" />
                {"  "}
                {garageData.rating} Ratings
                {isGarageClosed ? (
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {" "}
                    | Closed
                  </Text>
                ) : (
                  <Text style={{ color: "green", fontWeight: "bold" }}>
                    {" "}
                    | Open
                  </Text>
                )}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.customButton,
                    selectedButton === "Services" && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedButton("Services")}
                >
                  <View style={styles.buttonWithIcon}>
                    <Feather name="tool" size={20} color="white" />
                    <Text style={styles.buttonText}>{"  "}Services</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.customButton,
                    selectedButton === "About" && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedButton("About")}
                >
                  <View style={styles.buttonWithIcon}>
                    <Feather name="info" size={20} color="white" />
                    <Text style={styles.buttonText}>{"  "}About Us</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.descriptionContainer}
                showsVerticalScrollIndicator={false}
              >
                {selectedButton === "Services" && (
                  <Text style={styles.descriptionText}>{garageData.about}</Text>
                )}
                {selectedButton === "About" && (
                  <TouchableOpacity onPress={handleContactUs}>
                    <View style={[styles.contactContainer]}>
                      <Text
                        style={[styles.contactText, { textAlign: "justify" }]}
                      >
                        <Text style={styles.phoneNumber}>
                          {garageData.about}
                        </Text>{" "}
                      </Text>
                    </View>

                    <View style={[styles.contactContainer, { marginTop: 20 }]}>
                      <Feather name="phone" size={20} color="black" />
                      <Text style={styles.contactText}>
                        <Text style={styles.phoneNumber}>
                          {"  "}0774 333 450
                        </Text>{" "}
                      </Text>
                    </View>

                    <View style={[styles.contactContainer, { marginTop: 20 }]}>
                      <Feather name="map-pin" size={20} color="black" />
                      <Text style={styles.contactText}>
                        <Text style={styles.phoneNumber}>
                          {"  "}
                          {garageData.address}
                        </Text>{" "}
                      </Text>
                    </View>

                    <View style={[styles.contactContainer, { marginTop: 20 }]}>
                      <Feather name="clock" size={20} color="black" />
                      <Text style={styles.contactText}>
                        <Text style={styles.phoneNumber}>
                          {"  "}Open : 9.00 AM - 10.00 PM
                        </Text>{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>
            Error fetching data. Please try again later.
          </Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => handleRequestMechanic(Id)}
      >
        <Text style={styles.buttonText}>Request a Mechanic</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Garage Closed</Text>
            <Text style={styles.modalText}>
              Sorry, the garage is closed at this Time.
            </Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: "white",
    padding: 10,
  },
  rating: {
    color: "gray",
    fontSize: 16,
  },
  username: {
    color: "black",
    fontWeight: "600",
    fontSize: 24,
    marginVertical: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: 250,
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
    margin: 2,
  },
  selectedButton: {
    backgroundColor: "brown",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionContainer: {
    maxHeight: 330, // Set a maximum height for the description
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "black",
    marginBottom: 20,
    textAlign: "justify",
    margin: 10,
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  requestButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  topic: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  buttonWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  phoneNumber: {
    color: "black",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  // Inside the styles object
  modalButton: {
    fontSize: 16,
    color: "white",
    backgroundColor: "orange", // Background color for the button
    padding: 5, // Add some padding to make it look like a button
    borderRadius: 5, // Add rounded corners
    textAlign: "center", // Center the text horizontally
    width: 70, // Set a fixed width for the button
  },
});

export default GarageInfo;