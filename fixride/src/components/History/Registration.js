import { View, Text, TouchableOpacity,TextInput,StyleSheet,Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { firebase } from '../../config/firebase';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler';

const validatePassword = (password) => {
  const digitRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/;
  const alphabetRegex = /[a-zA-Z]/;
  const lengthValid = password.length >= 8 && password.length <= 20;

  return (
    digitRegex.test(password) &&
    specialCharRegex.test(password) &&
    alphabetRegex.test(password) &&
    lengthValid
  );
};

const Registration = () => {
 
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("User");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conpasswordVisible, setConPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [passerror, setPassError] = useState("");
  const [conerror, setConError] = useState("");
  const [nameerror, setNameerror] = useState("");

  useEffect(() => {
    if (firstname.trim() !== "") {
      setNameerror("");
    }
  }, [firstname]);

  registerUser = async(email,password,firstname,gender,phone,userType)=>{
    if(firstname.trim() === ""){
      alert("Username is required");
    }else if(firstname.length <= 3){
      setNameerror('Atleast 4 character needed');

    }
    if(gender.trim() === ""){
      alert("Gender is required");
    }
    if(password === confirmPassword){
    await firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp:true,
        url:'https://fixride-50426.firebaseapp.com',

      })
      .then(() => {
        alert('Verification email sent')
      }).catch((error) => {
        alert(error.message)
      })
      .then(() => {
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          firstname,
          gender,
          email,
          phone,
          userType,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
    })
    .catch((error) => {
      alert(error.message)
    })
  }else{
    alert('Password mismatching');
  }
  }

  const handlePasswordChange = (text) => {
    setPassword(text);

    if (validatePassword(text) || text === "") {
      setPassError("");
    } else {
      setPassError(
        "Password must contain at least one digit, one special character, one alphabet, and be 8-20 characters long"
      );
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPPassword(text);

    if (validatePassword(text) || text === "") {
      setConError("");
    } else {
      setConError(
        "Password must contain at least one digit, one special character, one alphabet, and be 8-20 characters long"
      );
    }
  };

  const handlePhoneChange = (text) => {
    // Check if the input is numeric
    if (/^[0-9]*$/.test(text) || text === "") {
      setPhone(text);
      if (text.length >= 10 && text.length <= 15) {
        setError(""); // Clear the error message
      } else {
        setError("Phone number must have 10-15 digits");
      }
    } else {
      // Display an alert for invalid input
      Alert.alert("Invalid Input", "Please enter only numeric values.", [
        { text: "OK" },
      ]);
    }
  };

    return(
      <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", fontSize: 23 }}>Sign Up</Text>
        <View style={{ marginTop: 40 }}>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            onChangeText={(firstname) => setFirstName(firstname)}
            autoCorrect={false}
          />
          {nameerror ? <Text style={styles.errorText}>{nameerror}</Text> : null}

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Phone number"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="numeric" // Set the keyboardType to numeric
            autoCorrect={false}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textPass}
              placeholder="Password"
              onChangeText={(password) => setPassword(password)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Text style={{ fontWeight: "bold", color: "black" }}>
                {passwordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {passerror ? <Text style={styles.errorText}>{passerror}</Text> : null}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textPass}
              placeholder="Confirm Password"
              onChangeText={(confirmPassword) =>
                setConfirmPPassword(confirmPassword)
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!conpasswordVisible}
            />
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setConPasswordVisible(!conpasswordVisible)}
            >
              <Text style={{ fontWeight: "bold", color: "black" }}>
                {conpasswordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {conerror ? <Text style={styles.errorText}>{conerror}</Text> : null}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="User" value="User" />
              <Picker.Item label="Garage Owner" value="Garage Owner" />
            </Picker>
          </View>

        </View>
        <TouchableOpacity
          onPress={() =>
            registerUser(email, password, firstname, gender, phone, userType)
          }
          style={styles.button}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22, color: "white" }}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
onPress={()=>  registerUser(email,password,firstname,gender,phone,userType)}
style={styles.button}
>
<Text style={{fontWeight:'bold', fontSize:22,color:'white'}}>Sign Up</Text>
</TouchableOpacity>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "orange",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Sign in
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};
   
export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 60,
  },
  textPass: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  showButton: {
    position: "absolute",
    right: 15,
  },
  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
  },
  picker: {
    flex: 2,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "red", // Add your desired border color here
  },
  button: {
    marginTop: 50,
    height: 50,
    width: 400,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "white",
    alignSelf: "center",
  },
  errorText: {
    color: "red",
  },
});
