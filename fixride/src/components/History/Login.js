import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../config/firebase";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const forgetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 26, textAlign: "center" }}>
        Login
      </Text>
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />
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
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => forgetPassword()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ fontWeight: "bold", color: "red", fontSize: 16 }}>
            Forget Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={styles.button}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22, color: "white" }}>
          Login
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Don't have an account?
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: "orange",
            textAlign: "center",
          }}
        >
          Register Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    height: 60,
    width: 400,
  },
  textPass: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  showButton: {
    position: "absolute",
    right: 15,
  },
});
