import {View,Text,TextInput,Image,StyleSheet,TouchableOpacity,FlatList,ScrollView,} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs,onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { firebase} from '../../config/firebase'
import TrackLive from "./TrackLive";
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const MyActivity = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedButton, setSelectedButton] = useState("Ongoing");
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  imageSource = require("../../../assets/images/no1.png");
 
  useEffect(()=>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot)=>{
      if(snapshot.exists){
        setUser(snapshot.data())
        setName(snapshot.data().firstname);
      }
      else{
        console.log('User does not exist');
      }
    }).catch((error)=>{
      alert(error);
    })
  },[])


  console.log("name",name);
  useEffect(() => {
    fetchData();
  }, [selectedButton]);

  const onSearch = () => {
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    console.log("Fetching data...",selectedButton);
  
    // Build the query
    console.log("dd",name);
    console.log("dd1",selectedButton);
    const query = firebase.firestore().collection('request')
      .where("username", "==", name).where("mainStatus", "==", selectedButton); // Filter documents where "username" matches "name"
  
    try {
      const querySnapshot = await query.get();
      console.log("querySnapshot", querySnapshot);
      const usersList = [];
  
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        if (doc.exists) {
          const dateTimeString = doc.data().dateTime;
          const dateTime = new Date(dateTimeString);
          console.log("name", dateTimeString);
  
          const date = dateTime.toDateString(); // Get the date in a readable format
  
          const hours = dateTime.getHours();
          const minutes = dateTime.getMinutes();
          const amOrPm = hours >= 12 ? "pm" : "am";
          const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  
          const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
  
          const doneStatus = doc.data().doneStatus;
          const reachStatus = doc.data().reachStatus;
          const startStatus = doc.data().startStatus;
          const acceptStatus = doc.data().status;
          let currentStatus;
          if (doneStatus.trim() === "") {
            if (reachStatus.trim() === "") {
              if (startStatus.trim() === "") {
                if (acceptStatus.trim() === "") {
                  currentStatus = "Pending";
                } else {
                  currentStatus = acceptStatus;
                }
              } else {
                currentStatus = startStatus;
              }
            } else {
              currentStatus = reachStatus;
            }
          } else {
            currentStatus = doneStatus;
          }
  
          const query2 = firebase.firestore().collection('garage')
            .where("garageId", "==", doc.data().garageId); // Filter documents where "username" matches "name"
          
            console.log("query2", query2);
          try {
            const querySnapshot2 = await query2.get(); // Use a different variable for the inner query snapshot
            console.log("querySnapshot2", querySnapshot2);
            let gname;
            let gno;

            querySnapshot2.forEach((doc2) => {
              if (doc2.exists) {
                console.log("doc2", doc2);
                gname=doc2.data().name;
                gno=doc2.data().contact;
                
              }
            });
           
            usersList.push({ ...doc.data(), id: doc.id, date: date, time: formattedTime, status: currentStatus,gname:gname,gno:gno });
            // console.log("gns",usersList)
          } catch (error) {
            console.error("Error fetching garage data:", error);
          }
        
       
        } 
      }));

      setData(usersList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  console.log("usersList1:", data);
  const handleItemPress = (id) => {
     console.log("item",id)
     navigation.navigate('TrackLive', { id });

  };
  const handleItemDetail = (id,reqDate,currentUser) => {
  navigation.navigate("Ongoing_details", { Requestid:id,
    Date: reqDate,
       Username: currentUser, });
      };

      const handleComDetail = (id,reqDate,currentUser) => {
        navigation.navigate("Com_details", { Requestid:id,
          Date: reqDate,
             Username: currentUser, });
            };

            const handleCanDetail = (id,reqDate,currentUser) => {
              navigation.navigate("Can_details", { Requestid:id,
                Date: reqDate,
                   Username: currentUser, });
                  };

  const renderItem = ({ item }) => (
    <View>
        {selectedButton === "Ongoing" ? (
          <>
          <TouchableOpacity onPress={() => handleItemDetail(item.vehicleNo,item.dateTime,item.username)}>
      <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.mainText}>{item.gname}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text>{item.gno}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusContainer}>
              <Text style={styles.mainstatus}>{item.mainStatus}</Text>
              <View style={styles.statusCircle}>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsContainer}>
              <TouchableOpacity onPress={() => handleItemPress(item.id)} style={styles.customTrack}>
                <Text style={styles.buttonTrack}>Track Live</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleItemDetail(item.vehicleNo,item.dateTime,item.username)} style={styles.customDetail}>
                <Text style={styles.buttonDetail}>Details</Text>
              </TouchableOpacity>
            </View>
            </View>
    </TouchableOpacity>
    </>
        ) : selectedButton === "Completed" ? (
          <>
          <TouchableOpacity onPress={() => handleComDetail(item.vehicleNo,item.dateTime,item.username)}>
      <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.mainText}>{item.gname}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text>{item.gno}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusContainer}>
              <Text style={styles.mainstatus}>{item.payment}</Text>
              <TouchableOpacity onPress={() => handleComDetail(item.vehicleNo,item.dateTime,item.username)} style={styles.customDetail}>
                <Text style={styles.buttonDetail}>Details</Text>
              </TouchableOpacity>
            </View>
            </View>
    </TouchableOpacity>
          </>
        ) : (
          <>
          <TouchableOpacity onPress={() => handleCanDetail(item.vehicleNo,item.dateTime,item.username)}>
      <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.mainText}>{item.gname}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text>{item.gno}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusContainer}>
              <Text style={styles.mainstatus}>{item.reason}</Text>
              <TouchableOpacity onPress={() => handleCanDetail(item.vehicleNo,item.dateTime,item.username)} style={styles.customDetail}>
                <Text style={styles.buttonDetail}>Details</Text>
              </TouchableOpacity>
            </View>
            </View>
    </TouchableOpacity>
          </>
        )}
     
    </View>
  );
  
  const filteredData = data.filter((item) => {
    const vehicleModel = item.vehicleModel || "";
    const vehicleNo = item.vehicleNo || "";
    const matter = item.matter || "";
    const date = item.date || "";
    const garageName = item.gname || "";
    return (
      (vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      item.mainStatus === selectedButton
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>My Activity</Text>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          onSubmitEditing={onSearch}
        />
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.customButton, { flex: 1, backgroundColor: selectedButton === "Ongoing" ? "orange" : "lightgray" }]}
            onPress={() => setSelectedButton("Ongoing")}
          >
            <Text style={styles.buttonText}>Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.customButton, { flex: 1, backgroundColor: selectedButton === "Completed" ? "orange" : "lightgray" }]}
            onPress={() => setSelectedButton("Completed")}
          >
            <Text style={styles.buttonText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.customButton, { flex: 1, backgroundColor: selectedButton === "Cancelled" ? "orange" : "lightgray" }]}
            onPress={() => setSelectedButton("Cancelled")}
          >
            <Text style={styles.buttonText}>Cancelled</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : filteredData.length === 0 ? (
        <View>
          <Image source={imageSource} style={styles.cardImage} />
          <Text style={styles.errormsg}>No records found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height:"100%"
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  mainText: {
    color: "black",
    fontWeight: "600",
    fontSize: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    textAlign: "right",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 16,
    textAlign: "right",
  },
  divider: {
    backgroundColor: "gray",
    height: 1,
    marginVertical: 10, // Adjust the margin as needed
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainstatus: {
    fontSize: 16,
    color:"orange",
  },
  status: {
    fontSize: 16,
    color:"green",
  }, 
  statusCircle: {
    backgroundColor: '#ccc',  
    borderRadius: 10,          
    alignItems: 'center',    
    justifyContent: 'center', 
    paddingHorizontal: 10,         
  }, 
  activityItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginTop:25,
    margin: 10,
    borderRadius: 5,
  },
  card: {
    margin: 10,
    padding: 16,
    backgroundColor: "rgba(255, 255, 0, 0.2)", // Change the background color as needed
    borderColor: "orange",
    borderRadius: 8,
    borderWidth: 2,
    marginTop:20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  customButton: {
    backgroundColor: "lightgray", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    height: 45,
  },
  cardImage: {
    position: "absolute",
    top: 220,
    left: "33%",
    width: 150, // Set the desired width
    height: 150, // Set the desired height
    borderRadius: 8,
  },
  errormsg: {
    color: "red", // Change the text color here
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    top: 370,
  },
  buttonText: {
    color: "black", // Change the text color here
    fontWeight: "bold",
  },
  buttonTrack: {
    color: "white", // Change the text color here
    fontWeight: "bold",
  },
  buttonDetail: {
    color: "black", // Change the text color here
    fontWeight: "bold",
  },
  customTrack: {
    backgroundColor: "#515151", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    height: 45,
  },
  customDetail: {
    backgroundColor: "#db884c", // Change the button color here
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    height: 45,
  },
  title: {
    padding: 3,
    backgroundColor: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MyActivity;