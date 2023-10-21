import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import img from '../assets/job.png';

const JobOverview = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.pageHeader}>Job Overview</Text>
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Customer Name</Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Vehicle Number</Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.boldText}>Location</Text>
        </View>
        <Image source={img} style={styles.image} />
        <Text style={styles.grayText}>Vehicle Information</Text>
        <View style={styles.compactBoxContainer}>
          {/* First Box */}
          <View style={styles.compactBox} />
          {/* Second Box */}
          <View style={styles.compactBox} />
          {/* Third Box */}
          <View style={styles.compactBox} />
        </View>
        <Text style={styles.grayText}>Customer Information</Text>
        <View style={styles.boxContainer}>
          {/* First Box in a new row */}
          <View style={styles.largeBox} />
        </View>
        <View style={styles.boxContainer}>
          {/* Second Box in a new row */}
          <View style={styles.largeBox} />
        </View>
        <Text style={styles.grayText}>Breakdown Description</Text>
        <View style={styles.bigBox} />
        <View style={styles.buttonContainer}>
          <Text style={styles.startRideButton}>Start Ride</Text>
          <Text style={styles.updateStatusButton}>Update Status</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  pageHeader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  subHeader: {
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    aspectRatio: 9 / 5,
    resizeMode: 'contain',
  },
  grayText: {
    color: 'gray',
    marginTop: 10,
    marginBottom: 10,
  },
  compactBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compactBox: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDAE10',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeBox: {
    width: '90%',
    height: 40,
    backgroundColor: '#ffffe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDAE10',
    marginBottom: 10,
  },
  bigBox: {
    width: '90%',
    height: 90,
    backgroundColor: '#ffffe6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDAE10',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  startRideButton: {
    backgroundColor: '#EDAE10',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  updateStatusButton: {
    backgroundColor: '#ffffe6',
    color: '#EDAE10',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EDAE10',
    textAlign: 'center',
  },
});

export default JobOverview;
