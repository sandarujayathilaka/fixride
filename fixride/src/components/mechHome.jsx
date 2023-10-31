import React,{useState,useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal,ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import img from '../../assets/WelcomeScreen.png';
import { firebase } from '../config/firebase'; 



const MechHome = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
 

  const changePassword =()=>{
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
    .then(()=>{
      alert("Password reset email sent")
    }).catch((error)=>{
      alert(error)
    })
  }
  
  

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
console.log(name.firstname);
  const handleAssignedJobPress = () => {
   
  navigation.navigate("Job" ,{name:name.firstname});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={img} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome {name.firstname}</Text>
          <Text style={styles.message}>Check your assigned work and makes customer happy!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonf} onPress={handleAssignedJobPress}>
            <Text style={styles.buttonTextWhite}>Assigned Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
      onPress={() => {changePassword()}}
      style={styles.buttonS}
      >
        <Text style={styles.buttonTextYellow}
      >Change Password
      </Text>
      </TouchableOpacity>
    

          <TouchableOpacity
      onPress={() => {firebase.auth().signOut()}}
      style={styles.buttonS}
      >
            <Text style={styles.buttonTextYellow}>Log out</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between', // Align content at the top and bottom
    flex: 1, // Take up all available space
  },
  image: {
    width: '80%', // Cover 80% of the screen width
    aspectRatio: 16 / 5, // Maintain the image's aspect ratio
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop:20,

  },
  buttonf: {
    backgroundColor: '#EDAE10',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttonS: {
    backgroundColor: '#FFFFF',
    borderColor: '#EDAE10',
    borderWidth: 1, // 1-pixel border width
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttonTextWhite: {
    color: 'white',
    fontSize: 18,
  },
  buttonOutline: {
    borderColor: '#EDAE10',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', // Make buttons take up the full width
  },
  buttonTextYellow: {
    color: '#EDAE10',
    fontSize: 18,
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

export default MechHome;
