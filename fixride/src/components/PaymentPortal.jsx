import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../../src/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const PaymentPortal = (props) => {
  const RequestId = props.RequestId;
  const payment = props.payment;
   console.log("Pay", payment);
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCVV] = useState("");
  const [amount, setAmount] = useState("");

  const validateCard = (text) => /^[0-9]{16}$/.test(text);
  const validateExpiration = (text) => /^([0-9]{2})\/([0-9]{2})$/.test(text);
  const validateCVV = (text) => /^[0-9]{3,4}$/.test(text);

const handlePayment = async () => {
  try {
    console.log(RequestId);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Card Payment </Text>
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            cardNumber && !validateCard(cardNumber) && styles.invalidInput,
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { width: Dimensions.get("window").width - 40 },
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
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.halfInput}>
          <View
            style={[
              styles.inputWrapper,
              expiration &&
                !validateExpiration(expiration) &&
                styles.invalidInput,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Ex Date (MM/YY)"
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
        </View>
        <View style={styles.halfInput}>
          <View
            style={[
              styles.inputWrapper,
              cvv && !validateCVV(cvv) && styles.invalidInput,
              { marginLeft: 10 }, // Add margin here
            ]}
          >
            <TextInput
              style={styles.input}
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
        </View>
      </View>
      <View style={styles.payment}>
        <Text style={styles.paymentText}>Rs.{payment}.00</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 28,
    marginBottom: 20,
    color: "#333",
    marginTop:10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  halfInput: {
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
    paddingLeft: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 40,
    overflow: "hidden",
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "transparent",
    paddingLeft: 0,
  },
  invalidInput: {
    borderColor: "red",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  payButton: {
    backgroundColor: "#007BFF",
    width: "90%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  payButtonText: {
    color: "white",
    fontSize: 20,
  },
  payment:{
    marginTop:20,
    marginBottom:20
  },
   paymentText:{
   color:"green",
   fontSize:40,
   fontWeight:"500"
  }
});

export default PaymentPortal;
