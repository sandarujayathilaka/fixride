import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../../src/config/firebase";
import { doc, updateDoc,getDoc } from "firebase/firestore";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";

const PaymentPortal = (props) => {
  const RequestId = props.RequestId;
  const payment = props.payment;
  console.log("Pay", payment);
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCVV] = useState("");
  const [garageid, setGarageId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const payimage = require("../../assets/payimage.png");
  const navigation = useNavigation();
  const validateCard = (text) => /^[0-9]{16}$/.test(text);
  const validateExpiration = (text) => /^([0-9]{2})\/([0-9]{2})$/.test(text);
  const validateCVV = (text) => /^[0-9]{3,4}$/.test(text);

  const handlePayment = async () => {
    if (
      !validateCard(cardNumber) ||
      !validateExpiration(expiration) ||
      !validateCVV(cvv)
    ) {
      setErrorMessage("Please check the provided card information.");
      return;
    }

    try {
      console.log(RequestId);
      const requestDocRef = doc(db, "request", RequestId);
      const docSnapshot = await getDoc(requestDocRef);

      // Check if the document exists and then destructure its data
      if (docSnapshot.exists()) {
        const { garageId } = docSnapshot.data();
        setGarageId(garageId)
        // Now you can use the destructured attributes
        console.log('attribute1:', garageId);
     
      } else {
        console.log('Document does not exist.');
      }
      await updateDoc(requestDocRef, {
        payStatus: "Paid",
        mainStatus: "Completed",
      });
     
      setIsModalVisible(true);
      console.log("Payment successful!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleOk = () => {
       
    setIsModalVisible(false);
    navigation.navigate("Feedback",{id:RequestId,garageid:garageid})
  };

 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Card Payment </Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Text>*Only Accept: </Text>
      <View style={styles.imageContainer}>
        <Image source={payimage} style={styles.payImage} />
      </View>
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
              { marginLeft: 10 },
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
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Icon name="check-circle" size={60} color="green" />
          <Text style={styles.modalText}>Payment Success</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleOk}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginBottom: 30,
    color: "#333",
    marginTop: 10,
    fontWeight: "700",
  },
  imageContainer: {
    alignItems: "center",
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
    backgroundColor: "#E7B10A",
    width: "90%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginTop: 20,
  },
  payButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  payment: {
    marginTop: 20,
    marginBottom: 20,
  },
  paymentText: {
    color: "green",
    fontSize: 40,
    fontWeight: "500",
  },
  modalContainer: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#E7B10A",
    width: "30%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  payImage: {
    marginBottom: 10,
    width: 200,
    height: 100,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PaymentPortal;
