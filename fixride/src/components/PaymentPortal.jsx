import {
    doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../../src/config/firebase";

const PaymentPortal = (props) => {
    
 const RequestId = props.RequestId;
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCVV] = useState("");
  const [amount, setAmount] = useState("");

  const validateCard = (text) => /^[0-9]{16}$/.test(text);
  const validateExpiration = (text) => /^([0-9]{2})\/([0-9]{2})$/.test(text);
  const validateCVV = (text) => /^[0-9]{3,4}$/.test(text);

const handlePayment = async () => {
  // Validate payment details and perform the payment operation

  // Assuming you have the RequestId from props or some other source
  

  try {
    console.log(RequestId)
    const requestDocRef = doc(db, "request", RequestId); // Replace "request" with your Firestore collection name

    // Update the document with the new values
    await updateDoc(requestDocRef, {
      payStatus: "Paid",
      mainStatus: "Completed",
    });

    // Handle the success case
    console.log("Payment successful!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Portal</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            cardNumber && !validateCard(cardNumber) && styles.invalidInput,
          ]}
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text)}
        />
        {validateCard(cardNumber) && (
          <Icon
            name="check-circle"
            size={20}
            color="green"
            style={styles.icon}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            expiration &&
              !validateExpiration(expiration) &&
              styles.invalidInput,
          ]}
          placeholder="Expiration Date (MM/YY)"
          value={expiration}
          onChangeText={(text) => setExpiration(text)}
        />
        {validateExpiration(expiration) && (
          <Icon
            name="check-circle"
            size={20}
            color="green"
            style={styles.icon}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            cvv && !validateCVV(cvv) && styles.invalidInput,
          ]}
          placeholder="CVV"
          value={cvv}
          onChangeText={(text) => setCVV(text)}
        />
        {validateCVV(cvv) && (
          <Icon
            name="check-circle"
            size={20}
            color="green"
            style={styles.icon}
          />
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  invalidInput: {
    borderColor: "red",
  },
  icon: {
    marginLeft: 5,
  },
  payButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default PaymentPortal;
