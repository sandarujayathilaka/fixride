import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import img from '../../assets/job.png';
import { db } from "../../src/config/firebase";




const Job = ({ vehicleImage }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection('request')
          .where('mainstatus', '==', 'Ongoing')
          .where('macName', '==', 'Deno')
          .get();

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          const { username, vehicleNo } = doc.data();
          fetchedData.push({ username, vehicleNo });
        });

        if (fetchedData.length > 0) {
          setData(fetchedData[fetchedData.length - 1]); // Assuming you want to set data from the last retrieved item
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  

  const { username, vehicleNo } = data;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={img} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Assigned Job</Text>
          <View style={styles.cardContainer}>
            <Text style={styles.text}>Customer Name: {username}</Text>
            <Text style={styles.text}>Vehicle Number: {vehicleNo}</Text>
            <Text style={styles.text}>Location: </Text>
            <Image source={{ uri: vehicleImage }} style={styles.vehicleImage} />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View More</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.goButton}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    aspectRatio: 16 / 5,
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    borderColor: '#EDAE10',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginTop: 40,
    width: '80%',
    alignItems: 'left', // You can change this to 'flex-start' for left alignment
  },
  text: {
    fontSize: 18,
  },
  vehicleImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#EDAE10',
    borderWidth: 1,
    borderColor: 'yellow',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '100%', // Adjusted width to take up the full width of the card
    alignItems: 'center', // Centered within the card
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
  goButton: {
    backgroundColor: '#EDAE10',
    borderWidth: 1,
    borderColor: 'yellow',
    borderRadius: 50,
    padding: 20,
    marginTop: 100,
  },
});

export default Job;
