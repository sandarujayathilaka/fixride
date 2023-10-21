import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const cardData = [
  {
    id: "Car",
    title: "Car",
    imageSource: require("../../assets/RedCar.png"), // Replace with your image path
  },
  {
    id: "ThreeWeel",
    title: "Tuk-Tuk",
    imageSource: require("../../assets/tuktuk.png"), // Replace with your image path
  },
  {
    id: "Bicycle",
    title: "Bike",
    imageSource: require("../../assets/bike.png"), // Replace with your image path
  },
  {
    id: "Truck",
    title: "Truck",
    imageSource: require("../../assets/truck.png"), // Replace with your image path
  },
  {
    id: "Bus",
    title: "Bus",
    imageSource: require("../../assets/bus.png"), // Replace with your image path
  },
  {
    id: "All",
    title: "Any",
    imageSource: require("../../assets/All.png"), // Replace with your image path
  },
];

const CateCard = ({ id }) => {
  const navigation = useNavigation();

  const handleCardClick = (id) => {
    console.log("card", id);

    // Navigate to the "cat_list/[id]" screen with the cardId as a parameter

    navigation.navigate("CatList", { cardid: id });
  };

  return (
    <ScrollView>
      <View>
        <Text style={styles.topic}>Select Vehicle Category</Text>
      </View>
      <View style={styles.gridContainer}>
        {cardData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCardClick(item.id)}
            style={styles.gridItem}
          >
            <Image source={item.imageSource} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridItem: {
    flexBasis: "48%", // Adjust this value to control the width of each card (2 cards in a row)
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FEC400",
    marginVertical: 8,
    backgroundColor: "#FFFBE7",
  },
  cardImage: {
    width: "90%",
    height: 90, // Adjust this value to control the image height
    borderRadius: 8,
  },
  cardTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  topic: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default CateCard;
