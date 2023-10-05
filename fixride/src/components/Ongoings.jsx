import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";

const mockData = [
  {
    id: 1,
    name: "DK CAR SERVICE",
    phoneNumber: "123-456-7890",
    date: "16 september 2023",
    time: "7.55 AM",
  },
  {
    id: 2,
    name: "DK CAR SERVICE",
    phoneNumber: "987-654-3210",
    date: "16 september 2023",
    time: "7.55 AM",
  },
  {
    id: 3,
    name: "DK CAR SERVICE",
    phoneNumber: "456-789-0123",
    date: "16 september 2023",
    time: "7.55 AM",
  },
  {
    id: 4,
    name: "DK CAR SERVICE",
    phoneNumber: "789-012-3456",
    date: "16 september 2023",
    time: "7.55 AM",
  },
  {
    id: 5,
    name: "DK CAR SERVICE",
    phoneNumber: "567-890-1234",
    date: "16 september 2023",
    time: "7.55 AM",
  },
];

const Ongoings = () => {
  return (
    <ScrollView style={styles.container}>

<Text style={styles.text}>Ongoing Repairs</Text>
      <Text style={styles.text2}>18 request found</Text>

      <View style={styles.cardContainer}>
        {mockData.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.cardText}>{card.name}</Text>
                <Text style={{}}>Phone: {card.phoneNumber}</Text>
              </View>

              <View style={{ flexDirection: "column" }}>
                <Text style={styles.cardText}>{card.date}</Text>
                <Text style={{ textAlign: "right" }}>Phone: {card.time}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Track status</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Ongoings;

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 40,
        marginLeft: 13,
      },
      text2: {
        fontSize: 15,
        marginLeft: 13,
      },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginVertical: 10,
  },
  container: {
    width: "100%",
    height: "100%",
    marginTop: 60,
  },
  card: {
    height: 140,
    marginTop: 20,
    backgroundColor: "#fff4e0",
    marginHorizontal: 13,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFAC1C",
  },
  cardText: {
    fontSize: 18,
  },
  button: {
    borderWidth: 1,

    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "gray",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cardImage: {
    width: 100,
    height: 40,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
