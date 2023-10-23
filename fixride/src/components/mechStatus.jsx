import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import GoodJob from '../../assets/GoodJob.gif';
import { router } from "expo-router";

const MechStatusUpdate = () => {

  const handleHomePress = () => {
 
    router.push(`/Home/Homen/`);

  };

  const [status, setStatus] = useState('unavailable');
  const [gifSource, setGifSource] = useState({
    'Done': GoodJob
  });

  const userName = 'Asanka Idunil';

  const handleActivate = async (newStatus) => {
    if (userName === 'Asanka Idunil') {
      setStatus(newStatus);
      const mechanicCollection = collection(db, 'mechanic');
      const q = query(mechanicCollection, where('name', '==', userName));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const docRef = doc.ref; 
        if (newStatus === 'Done') {
          updateDoc(docRef, { availability: 'available' });
          setGifSource(Done);
        }
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.topic}>Update Your Availability</Text>
        <View style={styles.chainContainer}>
          <View style={styles.point}>
            <Text style={styles.text}>{status === 'Done' ? '✔' : ''}</Text>
            <Text style={styles.text}>Done</Text>
          </View>
        </View>
        <Image source={gifSource[status]} style={styles.image} />
        <View style={styles.buttonContainer}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleActivate('Done')}
            disabled={status === 'available'}
          >
            <Text style={styles.buttonText}>Available</Text>
          </TouchableOpacity>
          
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleHomePress}>
          <Text style={styles.confirmButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  topic: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    alignItems: 'center',
    margin: 10,
  },
  chain: {
    height: 2,
    width: 30,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 5,
  },
  image: {
    width: 450,
    height: 400,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ffffe6',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#EDAE10',
    width: 250,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#EDAE10',
    padding: 15,
    width: 350,
    marginVertical: 20,
    borderRadius: 10,

  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default MechStatusUpdate;
