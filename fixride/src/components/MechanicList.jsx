import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";

const MechanicList = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const requestDb = collection(db, "mechanic");
      const statusQuery = query(
        requestDb,
        where("availability", "==", "available")
      );
      const querySnapshot = await getDocs(statusQuery);
      const requestData = [];
      querySnapshot.forEach((doc) => {
        requestData.push({ id: doc.id, ...doc.data() });
      });
      setData(requestData);
    };

    fetchData();
  }, []);

  const handleViewDetailsClick = async (itemId) => {
    const requestRef = doc(db, "mechanic", itemId);
    const docSnap = await getDoc(requestRef);
    if (docSnap.exists()) {
      setSelectedItem(docSnap.data());
      setModalVisible(true);
    }
  };


const handleSearch = () => {
    const trimmedSearchInput = searchInput.trim();
    if (trimmedSearchInput === "") {
      setSearchResults([]);
    } else {
      const filteredData = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(trimmedSearchInput.toLowerCase()) ||
          item.specializations.some((specialization) =>
            specialization.toLowerCase().includes(trimmedSearchInput.toLowerCase())
          )
        );
      });
  
      setSearchResults(filteredData);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Available Mechanics</Text>
      </View>
      <Text style={styles.text2}>18 Mechanics found</Text>

      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by specialization or name"
        onChangeText={(text) => {
            setSearchInput(text);
            if (!text) {
            setSearchResults([]);
            }
        }}
            value={searchInput}
            />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        {(searchResults.length > 0 ? searchResults : data).map((item, index) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.cardText}>{item.name}</Text>
                <Text>{item.specializations.join("   |   ")}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleViewDetailsClick(item.id)}
            >
              <Text style={styles.buttonText2}>Assign</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal to display additional details */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          {/* Display the details from selectedItem */}
          {selectedItem && (
            <View>
              {/* Render the details here */}
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MechanicList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginTop: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 13,
  },
  text2: {
    fontSize: 15,
    marginLeft: 13,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  searchInput: {
    width: "70%",
    height: 40,
    borderColor: "#FFAC1C",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: "#EDAE10",
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  card: {
    height: 140,
    marginTop: 20,
    backgroundColor: "#FFFDF3",
    marginHorizontal: 13,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFAC1C",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFAC1C",
    backgroundColor: "#EDAE10",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 90,
    marginRight: 90,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 13,
    marginRight: 13,
  },
  buttonText2: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
