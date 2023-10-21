import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { firebase } from 'firebase/firestore'; // Ensure you have imported the firestore from the correct location

const JobStatusUpdate = () => {
  const [status, setStatus] = useState('On the way');
  const mainStatus = 'Ongoing'; // Assuming this is the main status
  const userName = 'Asanka Idunil'; // Replace 'YourUserName' with the current user's name

  const handleActivate = async (newStatus) => {
    if (mainStatus === 'Ongoing' && userName === 'Asanka Idunil') {
      setStatus(newStatus);
      const requestRef = firebase.firestore().collection('requests'); // Assuming 'requests' is the name of your collection

      // Assuming 'docId' is the ID of the relevant document you want to update
      const querySnapshot = await requestRef.where('macName', '==', userName).get();

      querySnapshot.forEach(async (doc) => {
        const docRef = requestRef.doc(doc.id);
        if (newStatus === 'On the way') {
          await docRef.update({ startStatus: 'Started' });
        } else if (newStatus === 'Reached') {
          await docRef.update({ reachStatus: 'Reached' });
        } else if (newStatus === 'Fixed') {
          await docRef.update({ fixedStatus: 'Fixed' });
        }
      });
    }
  };



  return (
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
      </View>
      <Image
        source={{ uri: 'https://example.com/your-image.png' }}
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleActivate('On the way')}
        >
          <Text style={styles.buttonText}>Activate On the way</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleActivate('Reached')}
        >
          <Text style={styles.buttonText}>Activate Reached</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleActivate('Fixed')}
        >
          <Text style={styles.buttonText}>Activate Fixed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topic: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
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
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
});

export default JobStatusUpdate;
