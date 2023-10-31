import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db } from '../config/firebase';
import { useRoute } from '@react-navigation/native';

function AddGarage() {
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [closedTime, setClosedTime] = useState('');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services,setServices] = useState('');
  const [rating, setRating] = useState('3.5');
  const route = useRoute();
  const { email } = route.params;
  const gatageCollection = collection(db, 'garage');

  const categories = [
    'Motorcycles',
    'Heavy',
    'Standard',
    'All',
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    })();
  }, []);

  const handleRegister = async () => {
    
    const docData = {
      email,
      about,
      address,
      category: selectedCategory,
      closedTime,
      contact,
      name,
      latitude,
      longitude,
      services,
      rating
    };

    try {
      // Add the document to the 'garage' collection
      const docRef = await addDoc(gatageCollection, docData);
      const garageId = docRef.id;
      console.log('Garage added with ID: ', garageId);

     
      setAbout('');
      setAddress('');
      setSelectedCategory('');
      setClosedTime('');
      setContact('');
      setName('');
      setLatitude('');
      setLongitude('');
      setServices('');
    } catch (error) {
      console.error('Error adding document: ', error);

    }
  };




  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Register Your Garage</Text>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder='Enter your garage name'
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setContact(text)}
        value={contact}
        keyboardType="numeric"
        placeholder='Enter your garage contact number'
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAddress(text)}
        value={address}
        placeholder='Enter your garage address'
        
      />

      <Text style={styles.label}>About:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAbout(text)}
        value={about}
        placeholder='Enter some details about your garage'
      />

        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((category, index) => (
            <Picker.Item label={category} value={category} key={index} />
          ))}
        </Picker>

      <Text style={styles.label}>Close Time:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setClosedTime(text)}
        value={closedTime}
        placeholder='Enter your garage closing time'
        
      /> 

      <Text style={styles.label}>Services:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setServices(text)}
        value={services}
        placeholder='Enter your services'
      /> 



  
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.addButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
         
        >
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
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FEC400',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#EDAE10',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
});

export default AddGarage;