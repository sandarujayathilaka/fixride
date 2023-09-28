import { View, Text, TouchableOpacity, StyleSheet,Image } from "react-native";
import React from 'react'

export default function RequestDetails() {

 const imageSource = require("../../assets/Picture2.png");

  return (
    <View style={styles.container}>
      <Text style={styles.topic}>Activity Details</Text>
      <View style={styles.serviceColumn}>
        <View>
          <Text style={styles.mainLable}>DK CAR SERVISE</Text>
          <Text style={{ fontSize: 16 }}>0771347786</Text>
        </View>
        <View style={styles.datetime}>
          <Text style={{ fontSize: 16 }}>16 September 2023</Text>
          <Text style={{ textAlign: "right", fontSize: 16, marginTop: 5 }}>
            07:55 AM
          </Text>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
        }}
      />

      <View style={styles.serviceColumn}>
        <View>
          <Text style={styles.mainLable}>Ongoing</Text>
        </View>
        <View style={styles.datetime}>
          <Text style={{ fontSize: 16 }}>Status</Text>
          <TouchableOpacity
            style={{ textAlign: "right", fontSize: 16, marginTop: 5 }}
          >
            <Text>Track Status</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
        }}
      />
      <View style={{ backgroundColor: "yellow", marginTop: 10 }}>
        <View style={styles.serviceColumn}>
          <View style={{ margin: 10 }}>
            <Text style={styles.mainLable}>Mechanic Details</Text>
            <TouchableOpacity style={{ fontSize: 16, marginTop: 5 }}>
              <Text>Live Track</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16 }}>Vehicle NO :</Text>
            <Text style={{ fontSize: 16 }}>ABCD-0010</Text>
          </View>
          <View style={styles.datetime}>
            <Image source={imageSource} style={styles.cardImage} />
            <Text style={{ fontSize: 16, textAlign: "right", margin: 15 }}>
              Mechanic Name
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
        }}
      />

      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Request Details</Text>
          <Text style={styles.detail}>Tire Punch</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle No</Text>
          <Text style={styles.detail}>5632</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Power Source</Text>
          <Text style={styles.detail}>Hybrid</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Breakdown Location</Text>
          <Text style={styles.detail}>Matara</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle Model</Text>
          <Text style={styles.detail}>Toyota</Text>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
        }}
      />

      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Fee</Text>
          <Text style={styles.detail}>Rs.5000.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.detail}>Unpaid</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.payButton}>
          <Text>Card Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  topic: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
    marginTop:0
  },
  mainLable: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceColumn: {
    flexDirection: "row",
  },
  datetime: {
    marginLeft: "auto",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 100,
  },
  customButton: {
    backgroundColor: "orange", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white", // Change the text color here
    fontWeight: "bold",
  },
  cardImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginTop: 0,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  detail: {
    flex: 1,
    textAlign: "right",
  },
  payButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 100,
    height: 45,
  },
});