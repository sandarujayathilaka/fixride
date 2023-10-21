import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import img from '../../assets/WelcomeScreen.png';
import { router } from "expo-router";

const MechHome = () => {

  const handleAssignedJobPress = () => {
    // Navigate to the Job component when the "Assigned Job" button is pressed
    router.push(`/Job/Jobs/`);

  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={img} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.message}>We're here to support you every step of the way!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonf} onPress={handleAssignedJobPress}>
            <Text style={styles.buttonTextWhite}>Assigned Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={() => { /* Handle Log out button press */ }}>
            <Text style={styles.buttonTextYellow}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between', // Align content at the top and bottom
    flex: 1, // Take up all available space
  },
  image: {
    width: '80%', // Cover 80% of the screen width
    aspectRatio: 16 / 5, // Maintain the image's aspect ratio
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop:220,

  },
  buttonf: {
    backgroundColor: '#EDAE10',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttons: {
    backgroundColor: '#FFFFF',
    borderColor: '#EDAE10',
    borderWidth: 1, // 1-pixel border width
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttonTextWhite: {
    color: 'white',
    fontSize: 18,
  },
  buttonOutline: {
    borderColor: '#EDAE10',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttonTextYellow: {
    color: '#EDAE10',
    fontSize: 18,
  },



  
});

export default MechHome;
