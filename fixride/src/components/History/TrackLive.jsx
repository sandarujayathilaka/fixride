import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Modal, Button } from 'react-native';
import MapView, { Marker, AnimatedRegion, Circle } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../../constants/googleMapKey';
import imagePath from '../../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from './Loader';
import { addDoc, collection, updateDoc, getDoc,doc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useRoute } from '@react-navigation/native';
import { locationPermission, getCurrentLocation } from '../../helper/helperFunction';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const TrackLive = () => {
  const route = useRoute();
  const { id } = route.params;
 
 let requestId = id;
 console.log("rid",requestId);
    const mapRef = useRef()
    const markerRef = useRef()
 
 
    const [state, setState] = useState({
        curLoc: {
          latitude: 8.7542,
          longitude: 80.4982,
      },
        destinationCords: {
          latitude: 8.7542,
          longitude: 80.4981,
      },
        isLoading: true,
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
    const markerCoordinate = coordinate;
    const [circleRadius, setCircleRadius] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorModel, setErrorModel] = useState(false);
  
    const checkReached = () => {
        console.log("rgfeached");
        console.log(destinationCords.latitude,curLoc.latitude);
        console.log(destinationCords.longitude,curLoc.longitude);
        if(isReached === false){
        if (
          destinationCords.latitude === curLoc.latitude &&
          destinationCords.longitude === curLoc.longitude
        ) {
          // Destination is reached
          console.log("reached");
          setModalVisible(true);
          setState((prevState) => ({ ...prevState, isReached: true }));
        }else{
            console.log("unreached");
        }
      }
      };

      useEffect(() => {
        getLocation()
    }, [])

    useEffect(() => {
      const maxRadius = 500;
      const minRadius = 250;
      let increasing = true; // Indicates whether the radius is increasing
    
      const circleAnimationInterval = setInterval(() => {
        if (increasing) {
          // Increase the radius
          setCircleRadius((prevRadius) => {
            if (prevRadius < maxRadius) {
              return prevRadius + 50;
            } else {
              increasing = false;
              return prevRadius - 50;
            }
          });
        } else {
          // Decrease the radius
          setCircleRadius((prevRadius) => {
            if (prevRadius > minRadius) {
              return prevRadius - 50;
            } else {
              increasing = true;
              return prevRadius + 50;
            }
          });
        }
      }, 1000); // Adjust the interval as needed
    
      return () => clearInterval(circleAnimationInterval);
    }, []);
    

    useEffect(() => {
        checkReached();
      }, [curLoc, destinationCords]);

      const closeModal = () => {
        setState((prevState) => ({ ...prevState, isReached: true }));
        setModalVisible(false);
      };
      
      const confirmReached = async () => {
        closeModal(); // Close the pop-up modal
        try {
          console.log('Reach status');
          // Set a flag in your state to prevent the modal from appearing again
          // For example, you can add a reached flag to your state
          // updateState({ reached: true });
        } catch (error) {
          console.error('Failed to reach status:', error);
        }
      };

      const errorcloseModal = () => {
       
        setErrorModel(false);
      };
      
      const confirm = async () => {
        closeModal(); // Close the pop-up modal
        try {
        
        } catch (error) {
          console.error('Failed to reach status:', error);
        }
      };

      const getLocation = async () => {
        try {
            const docRef = collection(db, "tracking");
            const doc = await getDocs(docRef);
            console.log("ddd", doc);
            let foundDocumentRef = null;
    
            doc.forEach((doc1) => {
                const id = doc1.data().requestId;
                console.log("id", id);
                console.log("eid", requestId);
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
                    const { mehanicLocation, userLocation,heading } = foundDocumentSnapshot.data();
                    console.log("cugetrrent", mehanicLocation, userLocation);
                    if (mehanicLocation && userLocation && heading) {
                    const curLoc = {
                        latitude: parseFloat(mehanicLocation.latitude),
                        longitude: parseFloat(mehanicLocation.longitude),
                    };
                    console.log("curLoc", curLoc);
    
                    const destinationCords = {
                        latitude: parseFloat(userLocation.latitude),
                        longitude: parseFloat(userLocation.longitude),
                    };
                    console.log("destinationCords", destinationCords);
    
                    animate(curLoc.latitude, curLoc.longitude);
                    console.log("heading", heading);
                    updateState({
                        curLoc: curLoc,
                        destinationCords: destinationCords,
                        coordinate: new AnimatedRegion({
                            latitude: curLoc.latitude,
                            longitude: curLoc.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }),
                        heading: heading,
                        isLoading: false,
                    });
                  }else{
                    setErrorModel(true);
                  }
                } else {
                    console.log('Document not found'); // Handle if the document does not exist
                }
            } else {
                console.log('Reference not found'); // Handle if the document does not exist
            }
        } catch (error) {
            console.error(error);
            // Handle any errors that occur during fetching
        }
    };
    
console.log("state",state);
console.log("updateState",updateState);
    useEffect(() => {
        const interval = setInterval(() => {
            getLocation()
        }, 10000);
        return () => clearInterval(interval)
    }, [])
//
   
    const animate = (latitude, longitude) => {
      console.log("animate",latitude,longitude);
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
console.log("cul",curLoc);
console.log("del",destinationCords);
console.log("coo",coordinate);
    return (
        <View style={styles.container}>
 {modalVisible && ( // Display the pop-up modal when destination is reached
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
      {errorModel && ( // Display the pop-up modal when destination is reached
        <Modal transparent={true} visible={isReached}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Mechanic didn't start his journey.Please stay calm.</Text>
              <View style={styles.modalButtons}>
                <Button title="Close" onPress={errorcloseModal} />
                <Button title="Ok" onPress={confirm} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      {isLoading ? ( // Show loading until destinationCords is available
        <Loader isLoading={isLoading} />
      ) : (
        <>
            {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
            <Text>
  Distance left: {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(0)} km`}
</Text>
            <Text>
  Time left: {time < 1 ? `${(time * 60).toFixed(0)} sec` : `${time.toFixed(0)} min`}
</Text>

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
                        coordinate={markerCoordinate}
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
  <Circle
    center={{
      latitude: curLoc.latitude + 0.001, // Adjust based on the image size
      longitude: curLoc.longitude
    }}
    radius={circleRadius} // Controlled by state variable
    fillColor="rgba(0, 255, 0, 0.2)" // Fill color of the circle
  />

                    {Object.keys(destinationCords).length > 0 && (<Marker
                       coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                        {Object.keys(destinationCords).length > 0 && (
                            <MapViewDirections
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
                            console.log("tlc",result.coordinates)
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
                                console.log('GOT AN ERROR',errorMessage);
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
            </>
        )}
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
        alignItems:'center',
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
        borderWidth: 1,               // Add border
        borderColor: 'black',       // Specify border color
        marginLeft: 1,             // Add left margin
        marginRight: 1,
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,               // Add border
        borderColor: 'black',       // Specify border color
        marginLeft: 40,             // Add left margin
        marginRight: 40,
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