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

const cardData = [
  {
    id: "Car",
    title: "Card 1",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
  {
    id: "ThreeWeel",
    title: "Card 2",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
  {
    id: "Bicycle",
    title: "Card 3",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
  {
    id: "Truck",
    title: "Truck",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
  {
    id: "Bus",
    title: "Bus",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
  {
    id: "All",
    title: "All",
    imageSource: require("../../assets/Picture2.png"), // Replace with your image path
  },
];

function CateCard() {

const handleCardClick = (id) => {
  // Handle card click here, e.g., navigate to a new screen or perform an action.
  router.push(`/cat_list/${id}`, { cardId: id });
  console.log(`Clicked on card with ID ${id}`);
};



  return (
    <ScrollView>
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
}

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
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
  },
  cardImage: {
    width: "100%",
    height: 90, // Adjust this value to control the image height
    borderRadius: 8,
  },
  cardTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 30,
  },
});

export default CateCard;
