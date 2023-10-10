import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { db } from '../config/firebase'; // Import your Firestore instance
import { collection, query, where,getDoc, getDocs,updateDoc } from "firebase/firestore";

// Reusable components
import CustomBtn from './CustomBtn';

const ChooseLocation = (props) => {
  const navigation = useNavigation();

  const [state, setState] = useState({
    destinationCords: {},
    documentId: 'uwKvY48BLjJI1pfKDpV6', // Replace with the actual document ID
    isFetching: false, // Add a state to track fetching
  });

  const { destinationCords, documentId, isFetching } = state;

  // Fetch coordinates from the database based on the document ID
  const fetchDestinationCordsFromDatabase = async () => {
    console.log("latitude1");
    try {
      console.log("latitude5");
      const docRef = collection(db, "request");
      const doc = await getDocs(docRef);
  
      let foundDocumentRef = null; // Initialize to null
      console.log("did",doc);
      doc.forEach((doc1) => {
        console.log("id",id);
        const id = doc1.id;
        console.log("id",id);
                console.log("eid",documentId);
        if (id === documentId) {
          console.log("Document found:", id);
          foundDocumentRef = doc1.ref; // Store the found DocumentReference
        }
      });
  
      if (foundDocumentRef) {
        // Retrieve the data from the DocumentReference
        const foundDocumentSnapshot = await getDoc(foundDocumentRef);
        if (foundDocumentSnapshot.exists()) {
          const { latitude, longitude } = foundDocumentSnapshot.data();
          await updateDoc(foundDocumentRef, { startStatus: "Started" });
          setState({
            ...state,
            destinationCords: {
              latitude,
              longitude,
            },
          });
        } else {
          console.log('Document not found'); // Handle if the document does not exist
        }
      } else {
        console.log('Reference not found'); // Handle if the document does not exist
      }
  
      console.log("latitude4");
  
      
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during fetching
    }
  };
  
  

  const checkValid = async () => {
    if (documentId) {
      // Set isFetching to true before fetching coordinates
      setState((prevState) => ({
        ...prevState,
        isFetching: true,
      }));
      await fetchDestinationCordsFromDatabase(); // Wait for fetching to complete

      if (Object.keys(destinationCords).length === 0) {
        console.log('destination location is not found');
        return false;
      }
    }
    return true;
  };

  const onDone = async () => {
    const isValid = await checkValid(); // Wait for checkValid to complete
    if (isValid) {
      props.route.params.getCordinates({
        destinationCords,documentId,
      });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
      >
        <View style={{ marginBottom: 16 }} />
        <CustomBtn btnText="Done" onPress={onDone} btnStyle={{ marginTop: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChooseLocation;
