import { addDoc, collection, updateDoc,doc } from "firebase/firestore";
import React, { useState,useEffect } from "react";
import { View, Text, TextInput, Button, Modal,StyleSheet, TouchableOpacity } from "react-native";
import { db,firebase } from "../../config/firebase";
import Draggable from 'react-native-draggable';
import { router } from "expo-router";
import StarRating from 'react-native-star-rating';
import { useRoute,useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";

const Feedback = () => {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {id,garageid} = route.params;
console.log("id",id)
console.log("ga",garageid)

const fetchAndCalculateOverallRating = async () => {
  const garageId = garageid; // Replace with your garage ID
  const requestCollection = firebase.firestore().collection('request');

  // Step 1: Fetch the ratings for the garage
  const query = requestCollection.where('garageId', '==', garageId);
  try {
    const querySnapshot = await query.get();
    const ratings = [];
    console.log("q", query);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const rating = data.rate; // Replace 'rating' with the actual field name in your request document
      if (rating !== undefined) {
        ratings.push(rating);
      }
    });

    // Step 2: Calculate the overall rating

    console.log("Overall rating updated:", ratings);

    // overallRating = ratings.reduce((a, b) => a + b) / ratings.length;
    const numericRatings = ratings.map((rating) => parseInt(rating, 10));

    // Calculate the overall rating
    const overallRating =
      numericRatings.length > 0
        ? numericRatings.reduce((a, b) => a + b) / numericRatings.length
        : 0;

    const formattedOverallRating =
      overallRating % 1 === 0
        ? overallRating.toFixed(0) // Whole number, no decimal places
        : overallRating.toFixed(2); // Decimal number with 2 decimal places

    

    console.log("h", overallRating);
    const garageCollection = firebase.firestore().collection("garage");
    const quer = garageCollection.where("garageId", "==", garageId);
    const querySnapsho = await quer.get();
    console.log("Overall drating updated:", overallRating);
    if (!querySnapsho.empty) {
      querySnapsho.forEach(async (doc) => {
        // Update the 'rating' attribute of the matching document
        const garageDocRef = garageCollection.doc(doc.id);
        await updateDoc(garageDocRef, {
          rating: formattedOverallRating,
        });

        console.log("Overall rating updated:", overallRating);
      });
    } else {
      console.log("No document found with garageId:", garageid);
    }

    console.log("Overall rating updated:", overallRating);
  } catch (error) {
    console.error('Error fetching and calculating overall rating:', error);
  }
};

fetchAndCalculateOverallRating();


  const onStarRatingPress = (rating) => {
    setRate(rating); // Update the rating when a star is selected
  };

  const handleSave = async() => {
    // Handle saving the user data here
    
    const feedbackDb = doc(db, "request", id);
    try {
        await updateDoc(feedbackDb, {
          rate: rate,
          comment: comment,
       
        });
       await fetchAndCalculateOverallRating();
      
       setIsModalVisible(true);
        // Reset the form or navigate to a different screen
      } catch (error) {
       
      }

    //  router.push(`/feed/${name}`, { Id:name });
    // You can send this data to a server, store it in state, or perform any other action.
  };

  const handleOk = () => {
       
    setIsModalVisible(false);
    navigation.navigate('FIXRIDE');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Feedback</Text>
        <Text style={styles.labelRate}>Rate the Service:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={rate}
          starSize={30}
          fullStarColor="gold"
          selectedStar={(rating) => onStarRatingPress(rating)}
        />
        <Text style={styles.labelStar}>{rate} Stars</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setComment(text)}
          value={comment}
          placeholder="Write your Comment"
          editable
          multiline
          numberOfLines={5}
          maxLength={200}
        />
        <View>
          <TouchableOpacity style={styles.customButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      
      {isModalVisible && ( 
      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Icon name="check-circle" size={60} color="green" />
          <Text style={styles.modalText}>Feedback Submitted Successfully</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleOk}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      )}
      </View>
    </>
    
  );

};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  labelRate: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  labelStar: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 70,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
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
  modalContainer: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginTop:'auto'
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#E7B10A",
    width: "30%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Feedback;
