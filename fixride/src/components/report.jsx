import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRoute } from "@react-navigation/native";

const Report = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [description, setDescription] = useState('');
  const route = useRoute();
  const {requestId } = route.params;
  console.log(requestId);

  const handleSave = async () => {
    // Validation checks
    if (
      name === '' ||
      email === '' ||
      contactNumber === '' ||
      customerName === '' ||
      amount === '' ||
      paymentStatus === ''
    ) {
      Alert.alert('Validation Error', 'Check Again.');
      return;
    }

    // Email validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Invalid email format.');
      return;
    }

    // Contact number validation check
    const contactNumberRegex = /^[0-9]{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      Alert.alert('Validation Error', 'Contact number must be 10 digits and contain only numbers.');
      return;
    }

    // Amount validation check
    if (isNaN(parseFloat(amount))) {
      Alert.alert('Validation Error', 'Amount must be a valid number.');
      return;
    }

    const reportDb = collection(db, 'report');

    try {
      const docRef = await addDoc(reportDb, {
        name,
        email,
        contactNumber,
        customerName,
        amount,
        paymentStatus,
        description,
        requestId:requestId,
      });

      // Clear form fields
      setName('');
      setEmail('');
      setContactNumber('');
      setCustomerName('');
      setAmount('');
      setPaymentStatus('');
      setDescription('');

      console.log('Report added with ID: ', docRef.id);
      Alert.alert('Success', 'Job Done successfully.', [
        {
        
          text: 'OK',
          //onPress={handleUpdateStatusPress},
        },
      ]);
    } catch (error) {
      console.error('Error adding report: ', error);
      Alert.alert('Error', 'Failed to submit report.');
    }
  };
  const selectUnpaid = () => {
    setPaymentStatus('Unpaid');
  };

  // Function to set payment status to Paid
  const selectPaid = () => {
    setPaymentStatus('Paid');
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Breakdown Report</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Enter name"
      />


      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Enter email"
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setContactNumber(text)}
        value={contactNumber}
        placeholder="Enter contact number"
      />

      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setCustomerName(text)}
        value={customerName}
        placeholder="Enter customer name"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAmount(text)}
        value={amount}
        placeholder="Enter amount"
      />

<Text style={styles.label}>Payment Status</Text>
      <View style={styles.paymentStatusContainer}>
        <TouchableOpacity
          style={paymentStatus === 'Unpaid' ? styles.unpaidButton : styles.paidButton}
          onPress={selectUnpaid}
        >
          <Text style={paymentStatus === 'Unpaid' ? styles.buttonText : styles.buttonTextU}>Unpaid</Text>
        </TouchableOpacity>
        {/* Add space between buttons */}
        <View style={{ width: 80 }} />
        <TouchableOpacity
          style={paymentStatus === 'Paid' ? styles.unpaidButton : styles.paidButton}
          onPress={selectPaid}
        >
          <Text style={paymentStatus === 'Paid' ? styles.buttonText : styles.buttonTextU}>Paid</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder="Enter description"
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: 'blue',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#f2eab3',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  unpaidButton: {
    flex: 1,
    backgroundColor: '#EDAE10',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  paidButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    borderColor: '#EDAE10',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  buttonTextU: {
    color: '#EDAE10',
    fontWeight: 'bold',
  },

  descriptionInput: {
    height: 100,
    borderColor: '#f2eab3',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#EDAE10',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 40,
  },
});

export default Report;
