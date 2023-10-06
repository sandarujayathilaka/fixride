import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const GarageMngrDash2 = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./bg.png")} // Replace with the path to your image
        style={styles.image}
      />
      <Text style={styles.headline}>Hello Gihan</Text>
      <Text style={styles.headline}>Welcome to FixRide</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={require("./bg.png")} style={styles.cardImage} />
          </View>

          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={require("./bg.png")} style={styles.cardImage} />
          </View>

          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GarageMngrDash2;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 150,
    marginTop: 90,
  },
  headline: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  cardContainer: {
    flexDirection: "row", // Arrange items horizontally
    justifyContent: "space-evenly", // Add space between cards
    marginTop: 80, // Adjust the margin between the headlines and cards
  },
  card: {
    width: "40%", // Adjust the width as needed (percentage or fixed value)
    height: 140,
    backgroundColor: "#fff4e0",
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFAC1C",
    margin: 7
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFAC1C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  cardImage: {
    width: "100%", // Make the image width 100% of the card
    height: 40,
  },
});
