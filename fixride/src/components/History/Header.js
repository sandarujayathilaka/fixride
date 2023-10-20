import { View, Text } from 'react-native'
import React from 'react'

const Header = (props) => {
  console.log("props",props);
  return (
    <View style={{marginLeft:15}}>
      <Text style={{fontWeight:'bold',fontSize:28}}>{props.name}</Text>
    </View>
  )
}

export default Header