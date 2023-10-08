// import React, { Component } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       region: {
//         latitude: 0,
//         longitude: 0,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       },
//     };
//   }

//   componentDidMount() {
//     // Get the current location when the component mounts
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         this.setState({
//           region: {
//             latitude,
//             longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           },
//         });
//       },
//       (error) => console.error(error),
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//     );
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <MapView style={styles.map} region={this.state.region}>
//           <Marker
//             coordinate={{
//               latitude: this.state.region.latitude,
//               longitude: this.state.region.longitude,
//             }}
//             title="My Location"
//           />
//         </MapView>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Custom Button</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   button: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//   },
// });

// export default Home;

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Modal, Button } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../constants/googleMapKey';
import imagePath from '../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../components/Loader';
import { locationPermission, getCurrentLocation } from '../helper/helperFunction';
import { useFocusEffect } from '@react-navigation/native';
import { addDoc, collection, updateDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let requestId = '';

const Home = ({ navigation }) => {
    const mapRef = useRef()
    const markerRef = useRef()
    
    //const [requestId,setId] = useState('');
    const [state, setState] = useState({
        curLoc: {
            latitude: 8.7542,
            longitude: 80.4982,
        },
        destinationCords: {},
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 8.7542,
            longitude: 80.4982,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0,
        isReached: false,

    })

    const { curLoc, time, distance, destinationCords, isLoading, coordinate,heading, isReached } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const handleSave = async (id, destination) => {
        try {
          const trackingDb = collection(db, "tracking");
          const querySnapshot = await getDocs(trackingDb);
      
          let requestIdExists = false;
      
          // Iterate through the documents to check if requestId already exists
          querySnapshot.forEach((doc) => {
            const requestId = doc.data().requestId;
            console.log("hu",requestId);
            if (requestId === id) {
              requestIdExists = true;
              const latitude = destination.latitude;
              const longitude = destination.longitude;
              updateCurrentLocationInDatabase(requestId,latitude, longitude);
            }
          });
      
          if (!requestIdExists) {
            // If requestId doesn't exist, add a new document
            await addDoc(trackingDb, {
              requestId: id,
              userLocation: destination,
              mehanicLocation: curLoc,
            });
      
            console.log({
              type: 'success',
              text1: 'Feedback Submitted',
              text2: 'Thank you for your feedback!',
            });
          } else {
            console.log('Request ID already exists, updating location.');
          }
        } catch (error) {
          console.error('Failed to submit feedback:', error);
          console.log({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to submit feedback. Please try again.',
          });
        }
      };
      
      const checkReached = () => {
        console.log("rgfeached");
        console.log(destinationCords.latitude,curLoc.latitude);
        console.log(destinationCords.longitude,curLoc.longitude);
        
        if (
          destinationCords.latitude === curLoc.latitude &&
          destinationCords.longitude === curLoc.longitude
        ) {
          // Destination is reached
          console.log("reached");
          setState((prevState) => ({ ...prevState, isReached: true }));
        }else{
            console.log("unreached");
        }
      };

    useEffect(() => {
        getLiveLocation()
    }, [])

    useEffect(() => {
        checkReached();
      }, [curLoc, destinationCords]);

      const closeModal = () => {
        // Close the pop-up modal
        setState((prevState) => ({ ...prevState, isReached: false }));
      };

      const confirmReached = async () => {
        // Handle confirming that destination is reached
        closeModal(); // Close the pop-up modal
        try {
          // Update the reachStatus attribute in the request collection
          const requestDb = collection(db, "request");
          const requestDocRef = doc(requestDb, requestId); // Assuming 'requestId' is the document ID for the request
          await updateDoc(requestDocRef, { reachStatus: "Reached" });
    
          console.log('Reach status updated in the request collection');
        } catch (error) {
          console.error('Failed to update reach status:', error);
        }
      };

    const onPressLocation = () => {
        navigation.navigate('chooseLocation', { getCordinates: fetchValue })
    }
    const fetchValue = (data) => {
        console.log("this is data", data)
        requestId=data.documentId;
        const id = data.documentId;
        const destination = data.destinationCords;
        updateState({
            destinationCords: {
                latitude: data.destinationCords.latitude,
                longitude: data.destinationCords.longitude,
            }
        });
        handleSave(id,destination);
    }
console.log(requestId);
const updateCurrentLocationInDatabase = async (requestId, latitude, longitude) => {
    const trackingDb = collection(db, "tracking");
  
    if (requestId) {
      try {
        const querySnapshot = await getDocs(trackingDb);
        let docToUpdate = null;
  
        // Iterate through the documents to find the one with matching requestId
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData.requestId === requestId) {
            docToUpdate = doc.ref;
          }
        });
  
        if (docToUpdate) {
          await updateDoc(docToUpdate, {
            mehanicLocation: {
              latitude,
              longitude,
            },
          });
          console.log('Current location updated in the database');
        } else {
          console.error(`No document found with requestId: ${requestId}`);
        }
      } catch (error) {
        console.error('Failed to update current location in the database', error);
      }
    } else {
      console.error('requestId is empty or undefined');
    }
  };
  

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const { latitude, longitude, heading } = await getCurrentLocation()
            console.log("get live location after 4 second",heading)
             // latitude= 8.7542;
            //  longitude = 80.4982;
            console.log(latitude, longitude);
           // animate(latitude, longitude);
          
            animate(latitude, longitude);
            updateState({
                heading: heading,
                curLoc: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            });
           
            
            updateCurrentLocationInDatabase(requestId,latitude, longitude);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation()
        }, 10000);
        return () => clearInterval(interval)
    }, [])
//
   
    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: curLoc.latitude,
            longitude: curLoc.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }

    return (
        <View style={styles.container}>
 {isReached && ( // Display the pop-up modal when destination is reached
        <Modal transparent={true} visible={isReached}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>You have reached your destination!</Text>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={closeModal} />
                <Button title="Confirm" onPress={confirmReached} />
              </View>
            </View>
          </View>
        </Modal>
      )}
            {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text>Time left: {time.toFixed(0)} min</Text>
                <Text>Distance left: {distance.toFixed(0)} km</Text>
            </View>)}
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        ...curLoc,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >

                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                    >
                        <Image
                            source={imagePath.icBike}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>

                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                    {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={curLoc}
                        destination={destinationCords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance*1000} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                             console.log('GOT AN ERROR');
                        }}
                    />)}
                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={imagePath.greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                <Text>Are you going to start your journey..?</Text>
                <TouchableOpacity
                    onPress={onPressLocation}
                    style={styles.inpuStyle}
                >
                    <Text>Confirm your request</Text>
                </TouchableOpacity>
            </View>
            <Loader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        fontSize: 18,
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
});

export default Home;
