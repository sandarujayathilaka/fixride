import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../config/firebase";
import Draggable from 'react-native-draggable';
import { router } from "expo-router";
import StarRating from 'react-native-star-rating';
//import { useToast } from 'react-native-toast-message';

const Feedback = () => {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  
  const onStarRatingPress = (rating) => {
    setRate(rating); // Update the rating when a star is selected
  };

  const handleSave = async() => {
    // Handle saving the user data here
    const feedbackDb = collection(db, "feedback");
    try {
        await addDoc(feedbackDb, {
          rate: rate,
          comment: comment,
        //   user:id,
        });
        // Show a success toast
        // toast.show({
        //   type: 'success',
        //   text1: 'Feedback Submitted',
        //   text2: 'Thank you for your feedback!',
        // });
  
        // Reset the form or navigate to a different screen
      } catch (error) {
        // Handle any error, and optionally show an error toast
        // toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: 'Failed to submit feedback. Please try again.',
        // });
      }

    //  router.push(`/feed/${name}`, { Id:name });
    // You can send this data to a server, store it in state, or perform any other action.
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
          starSize={30} // Adjust the star size as needed
          fullStarColor="gold" // Change star color when selected
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
          maxLength={200} // You can adjust this limit
        />
        <View>
          <TouchableOpacity style={styles.customButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Submit</Text>
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
});

export default Feedback;
