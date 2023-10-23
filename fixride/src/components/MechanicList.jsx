import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
  

const MechanicList = ({ RequestId }) => {
  const router = useRouter();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [mName, setMechanicName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAssigned, setIsAssigned] = useState(false);
  const [modalClosed, setModalClosed] = useState(true);

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
  }, [modalClosed]); // Include modalClosed as a dependency

  const handleAssignMechanic = async (RequestId, mechanicName, macId, macPhone) => {
    try {
      const reqDocRef = doc(db, "request", RequestId);
      const mechanicDocRef = doc(db, "mechanic", macId);

      await Promise.all([
        updateDoc(reqDocRef, {
          status: "Approved",
          mainStatus: "Ongoing",
          assignStatus: "Assigned",
          macName: mechanicName,
          macId: macId,
          macContact: macPhone,
        }),
        updateDoc(mechanicDocRef, {
          availability: "unavailable",
        }),
      ]);

      // Update the state with the updated data
      const updatedData = data.map((item) => {
        if (item.id === macId) {
          return {
            ...item,
            availability: "unavailable",
          };
        }
        return item;
      });

      setData(updatedData);
      setIsAssigned(true);
      setModalVisible(true);
    } catch (error) {
      console.error("Error updating request and mechanic statuses:", error);
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

  const handleRejectClick = async (RequestId) => {
    if (RequestId) {
      const requestRef = doc(db, "request", RequestId);

      try {
        await updateDoc(requestRef, {
          status: "Rejected",
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleDoneClick = () => {
   // router.push(`/req-list/reqlist`);
   navigation.navigate("ReqList");
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
        {(searchInput.length > 0 ? searchResults : data).map((item, index) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.cardText}>{item.name}</Text>
                <Text style={styles.cardText2}>
                  {item.specializations.join("   |   ")}
                </Text>
              </View>

              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleAssignMechanic(
                      RequestId,
                      item.name,
                      item.id,
                      item.phoneNumber
                    );
                    setMechanicName(item.name);
                  }}
                >
                  <Text style={styles.buttonText2}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {searchInput.length > 0 && searchResults.length === 0 && (
          <Text style={styles.noMatchingMechanicsText}>
            No matching mechanics are available.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.bottomRejectButton}
        onPress={() => {
          handleRejectClick(RequestId);
        }}
      >
        <Text style={styles.buttonText2}>Reject</Text>
      </TouchableOpacity>

      {/* Modal to display additional details */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modelHeader}>
          {isAssigned ? (
            <View>
              <Text style={styles.cardText1}>{mName}</Text>
              <Text style={styles.cardText3}>has assigned to the job</Text>

              {/* <Image
                  source={require("../../assets/done.png")} 
                  style={styles.image}
               /> */}
              <Ionicons name="checkmark-done-circle" size={200} color="#C8E6C9" style={styles.image} />

              <TouchableOpacity
                // onPress={() => {
                //   handleDoneClick;
                //   setIsAssigned(false); 
                //   setModalVisible(false); 
                //   setModalClosed(!modalClosed);
                // }}
                onPress={handleDoneClick}
              >
                <Text style={styles.cardText4}>DONE</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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
    height: 100,
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
  cardText2: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFAC1C",
    backgroundColor: "#EDAE10",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
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
  modelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 30,
    marginRight: 13,
    marginTop:250,
  },

  cardText1: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft:100,
  },
  cardText3: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign:"center"
  },
  image: {
    marginLeft:78,
    marginTop: 65,
   
  },
  cardText4: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign:"center",
    textDecorationLine: 'underline', 
    textDecorationStyle: 'solid', 
    textDecorationColor: 'black',
    
  },
  bottomRejectButton:{
    alignItems: "center",
    backgroundColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 200,
    marginTop:15,
    marginBottom:10,
  }
});
