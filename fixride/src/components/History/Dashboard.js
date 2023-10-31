import { Text, StyleSheet, View, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import React,{useState,useEffect} from 'react'
import { firebase} from '../../config/firebase'
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
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


  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize:20, fontWeight:'bold'}}
      >Hello, {name.firstname}
      </Text>

      <TouchableOpacity
      onPress={() => {changePassword()}}
      style={styles.button}
      >
        <Text style={{fontSize:22, fontWeight:'bold',color:'white'}}
      >Change Password
      </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteAccount} style={styles.button}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>Delete Account</Text>
      </TouchableOpacity>

    
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

      <TouchableOpacity
      onPress={() => {firebase.auth().signOut()}}
      style={styles.button}
      >
        <Text style={{fontSize:22, fontWeight:'bold',color:'white'}}
      >Sign out
      </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container:{
      flex:1,
      alignItems:'center',
      marginTop:50,
  },
 
  button:{
      marginTop:50,
      height:70,
      width:250,
      backgroundColor:'orange',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:50,
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
})