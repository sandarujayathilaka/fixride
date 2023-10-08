import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Modal, Button } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../constants/googleMapKey';
import imagePath from '../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../components/Loader';
import { locationPermission, getCurrentLocation } from '../helper/helperFunction';
import { useFocusEffect } from '@react-navigation/native';
import { addDoc, collection, updateDoc, getDoc,doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let requestId = 'uwKvY48BLjJI1pfKDpV6';

const TrackLive = () => {
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

      
      const checkReached = () => {
        console.log("rgfeached");
        console.log(destinationCords.latitude1,curLoc.latitude);
        console.log(destinationCords.longitude1,curLoc.longitude);
        
        if (
          destinationCords.latitude1 === curLoc.latitude &&
          destinationCords.longitude1 === curLoc.longitude
        ) {
          // Destination is reached
          console.log("reached");
          setState((prevState) => ({ ...prevState, isReached: true }));
        }else{
            console.log("unreached");
        }
      };

      useEffect(() => {
        getLocation()
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
         
    
          console.log('Reach status');
        } catch (error) {
          console.error('Failed to reach status:', error);
        }
      };




    const getLocation = async () => {
        
        try {
           
            const docRef = collection(db, "tracking");
            const doc = await getDocs(docRef);
            console.log(doc);
            let foundDocumentRef = null;

            doc.forEach((doc1) => {
                const id = doc1.data().requestId;
                console.log("id",id);
                console.log("eid",requestId);
                if (id === requestId) {
                  console.log("Document found:", id);
                  foundDocumentRef = doc1.ref; // Store the found DocumentReference
                }
              });
              if (foundDocumentRef) {
                // Retrieve the data from the DocumentReference
                const foundDocumentSnapshot = await getDoc(foundDocumentRef);
                console.log(foundDocumentSnapshot);
                if (foundDocumentSnapshot.exists()) {
                    const { mehanicLocation, userLocation } = foundDocumentSnapshot.data();
                    const latitude = mehanicLocation.latitude;
                    const longitude = mehanicLocation.longitude;
                    const latitude1 = userLocation.latitude;
                    const longitude1 = userLocation.longitude;
                    animate(latitude, longitude);
            updateState({
                curLoc: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }),
                destinationCords:{latitude1,longitude1}
            });
           
        } else {
            console.log('Document not found'); // Handle if the document does not exist
          }
        } else {
          console.log('Reference not found'); // Handle if the document does not exist
        }
    
        console.log("latitude4");
    
        
      } catch (error) {
        console.error(error);
        // Handle any errors that occur during fetching
      }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getLocation()
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
              <Text style={styles.modalText}>Our mechanic reached your destination!</Text>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={closeModal} />
                <Button title="Ok" onPress={confirmReached} />
              </View>
            </View>
          </View>
        </Modal>
      )}
            {/* {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text>Time left: {time.toFixed(0)} min</Text>
                <Text>Distance left: {distance.toFixed(0)} km</Text>
            </View>)} */}
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
                                // transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>

                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                        {Object.keys(destinationCords).length > 0 && (
                            <MapViewDirections
                              origin={curLoc}
                              destination={{
                                latitude: destinationCords.latitude1,
                                longitude: destinationCords.longitude1,
                              }}
                              apikey={GOOGLE_MAP_KEY}
                              strokeWidth={6}
                              strokeColor="red"
                              optimizeWaypoints={true}
                              onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                              }}
                              // onReady={result => {
                        //     console.log(`Distance: ${result.distance*1000} km`)
                        //     console.log(`Duration: ${result.duration} min.`)
                        //     fetchTime(result.distance, result.duration),
                        //         mapRef.current.fitToCoordinates(result.coordinates, {
                        //             edgePadding: {
                        //                 // right: 30,
                        //                 // bottom: 300,
                        //                 // left: 30,
                        //                 // top: 100,
                        //             },
                        //         });
                        // }}
                              onError={(errorMessage) => {
                                console.log('GOT AN ERROR');
                              }}
                            />
                          )}
                          
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
                <Text>Wait our mechanic is on the way</Text>
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

export default TrackLive;