import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { db } from '../../src/config/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import ontheway from '../../assets/ontheway.gif';
import Reached from '../../assets/Reached.gif';
import done from '../../assets/done.gif';
import Paid from '../../assets/Paid.gif';
import { useNavigation,useRoute } from "@react-navigation/native";


const JobStatusUpdate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {name } = route.params;
  const [id, setId]=useState('');
  const handleConfirmPress = () => {
  console.log('js',id)
   navigation.navigate("Report",{requestId:id});
  };

  const [status, setStatus] = useState('On the way');
  const [gifSource, setGifSource] = useState({
    'On the way': ontheway,
    'Reached': Reached,
    'Fixed': done,
    'Paid' : Paid
  });

  useEffect(() => {
    // This effect will set the initial gifSource based on the current status
    setGifSource(gifSource[status]);
  }, [status]);

  const mainStatus = 'Ongoing';
  const userName = name;

  const handleActivate = async (newStatus) => {
    if (mainStatus === 'Ongoing' && userName === name) {
      setStatus(newStatus);
      const requestCollection = collection(db, 'request');
      const q = query(requestCollection, where('macName', '==', userName));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const docRef = doc.ref; 
        console.log(doc.id)
        setId(doc.id)
        if (newStatus === 'On the way') {
          setGifSource(ontheway);
          updateDoc(docRef, { startStatus: 'Started' });
          
        } else if (newStatus === 'Reached') {
          setGifSource(Reached);
          updateDoc(docRef, { reachStatus: 'Reached' });
         
        } else if (newStatus === 'Fixed') {
          setGifSource(done);
          updateDoc(docRef, { fixedStatus: 'Fixed' });
          
        } else if (newStatus === 'Paid') {
          setGifSource(Paid);
          updateDoc(docRef, { payStatus: 'Paid' });
          
        }
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.topic}>Update Job Status</Text>
        <View style={styles.chainContainer}>
          <View style={styles.point}>
            <Text style={styles.text}>{status === 'On the way' ? '✔' : ''}</Text>
            <Text style={styles.text}>On the way</Text>
          </View>
          <View style={styles.chain} />
          <View style={styles.point}>
            <Text style={styles.text}>{status === 'Reached' ? '✔' : ''}</Text>
            <Text style={styles.text}>Reached</Text>
          </View>
          <View style={styles.chain} />
          <View style={styles.point}>
            <Text style={styles.text}>{status === 'Fixed' ? '✔' : ''}</Text>
            <Text style={styles.text}>Fixed</Text>
          </View>
          <View style={styles.chain} />
          <View style={styles.point}>
            <Text style={styles.text}>{status === 'Paid' ? '✔' : ''}</Text>
            <Text style={styles.text}>Paid</Text>
          </View>
        </View>
        <Image source={gifSource} style={styles.image} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleActivate('On the way')}
            disabled={status === 'Started'}
          >
            <Text style={styles.buttonText}>Activate On the way</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleActivate('Reached')}
            disabled={status === 'Reached'}
          >
            <Text style={styles.buttonText}>Activate Reached</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleActivate('Fixed')}
            disabled={status === 'Fixed'}
          >
            <Text style={styles.buttonText}>Activate Fixed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleActivate('Paid')}
            disabled={status === 'Paid'}
          >
            <Text style={styles.buttonText}>Activate Paid</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
          <Text style={styles.confirmButtonText}>Confirm Completion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  topic: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    alignItems: 'center',
    margin: 10,
  },
  chain: {
    height: 2,
    width: 30,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 5,
  },
  image: {
    width: 400,
    height: 250,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ffffe6',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#EDAE10',
    width: 250,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#EDAE10',
    padding: 15,
    width: 350,
    marginVertical: 20,
    borderRadius: 10,

  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default JobStatusUpdate;
