import { useNavigation } from '@react-navigation/native';
import React,{useState,useEffect} from "react";
import { router } from "expo-router";  
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { firebase } from '../config/firebase'; 


const cardData = [
  {
    id: "addGarage",
    title: "Add New Garage",
    imageSource: require("../../assets/garageimage.png"),
  },
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
  {
    id: "Change",
    title: "Change Password",
    imageSource: require("../../assets/change.png"),
  },
  {
    id: "Delete",
    title: "Delete Account",
    imageSource: require("../../assets/deleteuser.jpg"),
  },
  {
    id: "SignOut",
    title: "Sign Out",
    imageSource: require("../../assets/signout.png"),
  },
];

function GarageMngrDash() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);


  const changePassword =()=>{
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
    .then(()=>{
      alert("Password reset email sent")
    }).catch((error)=>{
      alert(error)
    })
  }
  
  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };
  
  const confirmDeleteAccount = () => {
    // Delete user data from Firestore
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
    userRef
      .delete()
      .then(() => {
        // Delete user from Firebase Authentication
        const user = firebase.auth().currentUser;
        user
          .delete()
          .then(() => {
            // Sign out the user
            firebase.auth().signOut();
            alert('Account deleted successfully');
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

useEffect(()=>{
  firebase.firestore().collection('users')
  .doc(firebase.auth().currentUser.uid).get()
  .then((snapshot)=>{
    if(snapshot.exists){
      setName(snapshot.data())
    }
    else{
      console.log('User does not exist');
    }
  }).catch((error)=>{
    alert(error);
  })
},[])

const handleCardClick = (id) => {
  switch (id) {
    case 'addGarage':
      // Check if a record with a matching email exists in the garage collection
      firebase.firestore().collection('garage')
        .where('email', '==', name.email)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            alert('A garage with the same email already exists. You cannot add a new garage.');
          } else {
            navigation.navigate('AddGarage', { email: name.email });
          }
        })
        .catch((error) => {
          alert(error);
        });
      break;
    case 'addMechanic':
      navigation.navigate('AddMechanic');
      break;
    case 'ReqList':
      navigation.navigate('ReqList');
      break;
    case 'Change':
      changePassword();
      break;
    case 'Delete':
      setDeleteModalVisible(true);
      break;
    case 'SignOut':
      firebase.auth().signOut();
      break;
    default:
      break;
  }
};


  return (
    <ScrollView>
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
         <Modal animationType="slide" transparent={true} visible={isDeleteModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <TouchableOpacity onPress={confirmDeleteAccount} style={styles.buttons}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Yes, Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.buttonss}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Cancel</Text>
      </TouchableOpacity>
          
          </View>
        </View>
      </Modal>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop:20,
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
    marginLeft:45,
    alignItems: "center", 
    justifyContent: "center", 
    height:50,
    width:50,
  },
  cardTitle: {
    marginTop: 8,
    margin:8,
    textAlign: "center",
    fontSize: 20, // Adjust the font size as needed
  },
  centerText: {
    alignItems: "flex-start", // Align the text to the left
    marginBottom: 16,
    marginTop:19,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    marginTop:18,
    fontWeight: 'bold',
  },
  fixRideText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons:{
    height:50,
    width:250,
    backgroundColor:'red',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
},
buttonss:{
  height:50,
  width:250,
  marginTop:10,
  backgroundColor:'gray',
  alignItems:'center',
  justifyContent:'center',
  borderRadius:50,
},
});

export default GarageMngrDash;
