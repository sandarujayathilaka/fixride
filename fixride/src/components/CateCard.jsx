import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db,firebase } from "../../src/config/firebase";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

 

const homeLogo = require("../../assets/homelogo.jpg");
const cardData = [
  // {
  //   id: "Car",
  //   title: "Car",
  //   imageSource: require("../../assets/RedCar.png"), // Replace with your image path
  // },
  // {
  //   id: "ThreeWeel",
  //   title: "Tuk-Tuk",
  //   imageSource: require("../../assets/tuktuk.png"), // Replace with your image path
  // },
  {
    id: "Motorcycles",
    title: "Motorcycles",
    imageSource: require("../../assets/bike.png"), // Replace with your image path
  },
  {
    id: "Heavy",
    title: "Heavy Vehicles",
    imageSource: require("../../assets/bus.png"), // Replace with your image path
  },
  {
    id: "Standard",
    title: "Light Vehicles",
    imageSource: require("../../assets/RedCar.png"), // Replace with your image path
  },
  {
    id: "All",
    title: "All",
    imageSource: require("../../assets/All.png"), // Replace with your image path
  },
];

function CateCard() {
  const [timeGreeting, setTimeGreeting] = useState("");
  
  const [userdata, setUserData] = useState('');
  const navigation = useNavigation();

  const handleCardClick = (id) => {
    console.log("card", id);

    // Navigate to the "cat_list/[id]" screen with the cardId as a parameter

    navigation.navigate("CatList", { cardid: id ,phone:userdata.phone,firstname:userdata.firstname });
  };

  useEffect(()=>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot)=>{
      if(snapshot.exists){
        setUserData(snapshot.data())
        console.log(userdata)
      }
      else{
        console.log('User does not exist');
      }
    }).catch((error)=>{
      alert(error);
    })
  },[])



  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  useEffect(() => {
    const greeting = getTimeBasedGreeting();
    setTimeGreeting(greeting);
  }, []);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={homeLogo} style={styles.logocardImage} />
        <Text style={styles.greetingText}>Hi, {userdata.firstname}</Text>
        <Text style={styles.timeGreetingText}>{timeGreeting} ...</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F8", // Light blue background color
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E7B10A", // Yellow background color
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  logocardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 0,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF", // White text color
    marginTop: 10,
  },
  timeGreetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF", // White text color
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  gridItem: {
    flexBasis: "48%",
    backgroundColor: "#FFFFFF", // White background color
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FEC400", // Yellow border color
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  cardTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333", // Dark text color
  },
});

export default CateCard;