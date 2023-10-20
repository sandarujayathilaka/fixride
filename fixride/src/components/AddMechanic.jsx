import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { db } from '../config/firebase';

function AddMechanic() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specializations, setSpecializations] = useState(['', '']);

  const mechanicsCollection = collection(db, 'mechanic');

  const isPhoneNumberUnique = async (phoneNumber) => {
    const q = query(mechanicsCollection, where('phoneNumber', '==', phoneNumber));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleAddMechanic = async () => {
    if (!name || !phoneNumber) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return;
    }

    try {
      const isUnique = await isPhoneNumberUnique(phoneNumber);

      if (!isUnique) {
        Alert.alert('Error', 'Phone number is already in use.Please give an other phone number');
        return;
      }

      const newMechanic = {
        name,
        phoneNumber,
        specializations,
        availability: 'available',
      };

      const docRef = await addDoc(mechanicsCollection, newMechanic);

      console.log('Mechanic added successfully!');
      Alert.alert('Success', 'Mechanic added successfully.');

    setName('');
    setPhoneNumber('');
    setSpecializations(['', '']);

    } catch (error) {
      console.error('Error adding mechanic: ', error);
      Alert.alert('Error', 'Failed to add mechanic. Please try again later.');
    }
  };


  const handleCancel = () => {
    router.push(`/garageMngr-dash/grgMngrDash`);
  };

  const updateSpecialization = (index, text) => {
    const updatedSpecializations = [...specializations];
    updatedSpecializations[index] = text;
    setSpecializations(updatedSpecializations);
  };



  return (
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
        placeholder='Enter mechanic name'
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="numeric"
        placeholder='Enter mechanic contatct number'
      />

      <Text style={styles.label}>Specializations:</Text>
      <TextInput
        style={styles.input}
        placeholder="Most skilled area 1"
        onChangeText={(text) => updateSpecialization(0, text)}
        value={specializations[0]}
      />
      <TextInput
        style={styles.input}
        placeholder="Most skilled area 2"
        onChangeText={(text) => updateSpecialization(1, text)}
        value={specializations[1]}
      />

      

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMechanic}>
          <Text style={styles.buttonText}>Add Mechanic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:10,
  
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight:'bold'
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
  logo: {
    marginTop:16,
    marginBottom:16,
    marginHorizontal:70,
    width: 200, 
    height: 200, 
  },
  
});

export default AddMechanic;
