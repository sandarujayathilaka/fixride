import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db } from '../config/firebase';
import { useRouter } from 'expo-router';
function AddGarage() {

  const router = useRouter();

  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [closedTime, setClosedTime] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services,setServices] = useState('');
  const [rating, setRating] = useState('3.5');
  const [imageUrl, setImageUrl] = useState('No image');


  const gatageCollection = collection(db, 'garage');

  const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
  ];

  const service = [
    'Regular Care -  oil changes, fluid checks, filter replacements',
    'Repair and Diagnostics',
    'Tire Services',
    'All the services',
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


    const generateGarageId = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    };
    const garageId = generateGarageId();

    // Validation checks
    if (!name) {
      alert('Please enter your garage name.');
      return;
    }
  
    if (!contact || !/^\d{10}$/.test(contact)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
  
    if (!address) {
      alert('Please enter your garage address.');
      return;
    }
  
    if (!about) {
      alert('Please provide information about your garage.');
      return;
    }
  
    if (!selectedCategory) {
      alert('Please select a category for your garage.');
      return;
    }
  
    if (!closedTime) {
      alert('Please enter your garage closing time.');
      return;
    }
  
    if (!services) {
      alert('Please enter the services your garage offers.');
      return;
    }
  
    const docData = {
      about,
      address,
      category: selectedCategory,
      closedTime,
      openTime,
      contact,
      name,
      latitude,
      longitude,
      services,
      rating,
      garageId,
      imageUrl,

    };
  
    try {
      // Add the document to the 'garage' collection
      const docRef = await addDoc(gatageCollection, docData);
      const addedGarageId = docRef.id;
      console.log('Garage added with ID: ', addedGarageId);
  
      // Clear input fields
      setAbout('');
      setAddress('');
      setSelectedCategory('');
      setClosedTime('');
      setOpenTime('');
      setContact('');
      setName('');
      setLatitude('');
      setLongitude('');
      setServices('');

      handleNavigate();

    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  

  const handleNavigate = () => {
    router.push(`/garageMngr-dash/grgMngrDash`);
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
        <View style={styles.inputDropDown}>
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
        </View>

        <Text style={styles.label}> Services:</Text>
        <View  style={styles.inputDropDown}>
        <Picker
          selectedValue={services}
          onValueChange={(itemValue, itemIndex) => setServices(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select service" value="" />
          {service.map((service, index) => (
            <Picker.Item label={service} value={service} key={index} />
          ))}
        </Picker>
        </View>
       

      <Text style={styles.label}>Open Time:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setOpenTime(text)}
        value={openTime}
        placeholder='Enter your garage opening time'
        
      /> 

      <Text style={styles.label}>Close Time:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setClosedTime(text)}
        value={closedTime}
        placeholder='Enter your garage closing time' 
      /> 

      {/* <Text style={styles.label}>Services:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setServices(text)}
        value={services}
        placeholder='Enter your services'
      />  */}

      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.addButton} onPress={() => {
           handleRegister();   
       }}>
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
  inputDropDown: {
    borderWidth: 1,
    borderColor: '#FEC400',
    borderRadius: 8,
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