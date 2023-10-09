import { useNavigation } from '@react-navigation/native';
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
    imageSource: require("../../assets/Picture2.png"),
  },
  {
    id: "ReqList",
    title: "New Requests",
    imageSource: require("../../assets/Picture2.png"),
  },
];

function GarageMngrDash() {

  const handleCardClick = (id) => {
    switch (id) {
      case 'addMechanic':
        router.push(`/add-mechanic/add`);
        break;
      case 'ReqList':
        router.push(`/req-list/reqlist`);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
      />

      <View style={styles.centerText}>
        <Text style={styles.welcomeText}>WELCOME</Text>
        <Text style={styles.fixRideText}>TO </Text>
        <Text style={styles.fixRideText}>FixRide </Text>
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
    width: 200, 
    height: 200, 
    borderRadius: 100,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridItem: {
    flexBasis: "48%",
    backgroundColor: "#FFFBE7",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEC400",
    marginVertical: 8,
    marginRight:6,
  },
  cardImage: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },
  cardTitle: {
    marginTop: 8,
    margin:8,
    textAlign: "center",
    fontSize: 20, // Adjust the font size as needed
  },
  centerText: {
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    marginTop:18
  },
  fixRideText: {
    fontSize: 24,
  },
});

export default GarageMngrDash;
