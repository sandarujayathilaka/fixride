import { useNavigation } from "@react-navigation/native";
import React from "react";
import { router } from "expo-router";
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
    id: "addMechanic",
    title: "Add New Mechanics",
    imageSource: require("../../assets/addMac.png"),
  },
  {
    id: "ReqList",
    title: "New Requests",
    imageSource: require("../../assets/repReq.png"),
  },
];

function GarageMngrDash() {
  const navigation = useNavigation();

  const handleCardClick = (id) => {
    switch (id) {
      case "addMechanic":
        //router.push(/add-mechanic/add);
        navigation.navigate("AddMechanic");
        break;
      case "ReqList":
        // ReqList    router.push(/req-list/reqlist);
        navigation.navigate("ReqList");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/grgMngrDash.png")}
        style={styles.logo}
      />

      <View style={styles.centerText}>
        <Text style={styles.welcomeText}>Lets Fix More Vehicles Today</Text>
        <Text style={styles.fixRideText}>with FixRide 🙂</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 200,
    // borderRadius: 100,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridItem: {
    flexBasis: "45%",
    backgroundColor: "#FFFBE7",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 30,
    marginLeft: 10,
  },

  cardImage: {
    marginLeft: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    marginTop: 8,
    margin: 8,
    textAlign: "center",
    fontSize: 20, // Adjust the font size as needed
  },
  centerText: {
    alignItems: "flex-start", // Align the text to the left
    marginBottom: 16,
    marginTop: 19,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 24,
    marginTop: 18,
    fontWeight: "bold",
  },
  fixRideText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 7,
  },
});

export default GarageMngrDash;
