import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const cords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            heading: position?.coords?.heading,
                        };
                        resolve(cords);
                        console.log("web");
                        console.log(cords);
                    },
                    error => {
                        reject(error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                reject(new Error('Geolocation is not supported in this environment.'));
            }
        });
    } else {
        // For native platforms (iOS and Android)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const cords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                heading: location.coords.heading,
            };
            console.log("phone");
            console.log(cords);
            return cords;
        } else {
            throw new Error('Location Permission denied');
        }
    }
};

export const locationPermission = async () => {
    if (Platform.OS === 'ios') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            return 'granted';
        } else {
            throw new Error('Permission not granted');
        }
    } else if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            return 'granted';
        } else {
            throw new Error('Location Permission denied');
        }
    } else {
        // For other platforms, assume permission is granted
        return 'granted';
    }
};



// const showError = (message) => {
//     showMessage({
//         message,
//         type: 'danger',
//         icon: 'danger'
//     });
// };

// const showSuccess = (message) => {
//     showMessage({
//         message,
//         type: 'success',
//         icon: 'success'
//     });
// };

// export {
//     showError,
//     showSuccess
// };
