import { View, Text } from 'react-native'
import React from 'react'
import RequestForm from '../../src/components/RequestForm'
import { useGlobalSearchParams } from 'expo-router';

export default function form() {

   const params = useGlobalSearchParams();
   const garageId = params.id;
   const userLatitude = params.userLatitude
   const userLongitude = params. userLongitude
    

  return (
    <View>
      <RequestForm garageId={garageId} userLatitude={userLatitude} userLongitude={userLongitude} />
    </View>
  );
}