import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function ReqStatusGMside(props) {
  const [currentStatus, setCurrentStatus] = useState("Pending");
  const [RequestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [startStatus, setStartStatus] = useState("");
  const [reachStatus, setReachStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [doneStatus, setDoneStatus] = useState("");
  const [assignStatus, setAssignStatus] = useState("");
  const[payment,setPayment]=useState('');

  const statuses = ["Approved", "Started", "Reached", "Done"];

  const bwcorrect = require("../../assets/bwcorrect.png");
  const colorCorrect = require("../../assets/correctcol.png");
   const statusImg = require("../../assets/reqStatusGM.gif");

  useEffect(() => {
    setRequestId(props.RequestId);
  }, [props.RequestId]);

  useEffect(() => {
    const fetchData = async () => {
      if (RequestId) {
        setLoading(true);

        const requestRef = doc(db, "request", RequestId);
        try {
          const docSnapshot = await getDoc(requestRef);
          if (docSnapshot.exists()) {
            const latestRequest = docSnapshot.data();
            console.log(latestRequest);
            setCurrentStatus(latestRequest.status);
            setStartStatus(latestRequest.startStatus);
            setReachStatus(latestRequest.reachStatus);
            setPayStatus(latestRequest.payStatus);
            setDoneStatus(latestRequest.doneStatus);
            setAssignStatus(latestRequest.assignStatus);
            setPayment(latestRequest.payment);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error retrieving document: ", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [RequestId]);

  function VerticalLine({ isGreen }) {
    return (
      <View
        style={[styles.verticalLine, isGreen && styles.greenVerticalLine]}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image source={statusImg} style={styles.statusTopicImage} />
      </View>
      <View style={styles.allStatusContainer}>

        <View style={styles.statusContainer}>
          {startStatus === "Started" ? (
            <Image source={colorCorrect} style={styles.statusImage} />
          ) : (
            <Image source={bwcorrect} style={styles.statusImage} />
          )}
          <Text style={styles.statusText}>Started</Text>
        </View>
        <VerticalLine isGreen={startStatus === "Started"} />
        <View style={styles.statusContainer}>
          {reachStatus === "Reached" ? (
            <Image source={colorCorrect} style={styles.statusImage} />
          ) : (
            <Image source={bwcorrect} style={styles.statusImage} />
          )}
          <Text style={styles.statusText}>Reached</Text>
        </View>
        <VerticalLine isGreen={reachStatus === "Reached"} />
        <View style={styles.statusContainer}>
          {doneStatus === "Done" ? (
            <Image source={colorCorrect} style={styles.statusImage} />
          ) : (
            <Image source={bwcorrect} style={styles.statusImage} />
          )}
          <Text style={styles.statusText}>Done</Text>
        </View>
        <VerticalLine isGreen={doneStatus === "Done"} />
        <View style={styles.statusContainer}>
          {payStatus === "Paid" ? (
            <Image source={colorCorrect} style={styles.statusImage} />
          ) : (
            <Image source={bwcorrect} style={styles.statusImage} />
          )}
          <Text style={styles.statusText}>Paid</Text>
        </View>
      </View>
      <Text style={styles.statusText}>Payments</Text>
      <Text style={styles.statusText}>{payment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginLeft: 120,
  },
  statusImage: {
    width: 35, // Adjust the width as needed
    height: 35, // Adjust the height as needed
    marginRight: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight:"500"
  },
  verticalLine: {
    width: 3,
    height: "8%",
    backgroundColor: "gray", // Adjust the color as needed
    marginRight: 10,
    marginLeft: 133,
  },
  greenVerticalLine: {
    backgroundColor: "green", // Change the color to green
  },
  statusTopicImage: {
    width: 500, // Adjust the width as needed
    height: 250, // Adjust the height as needed
    marginRight: 10,
  },
  containerImage: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center",
    marginTop: 100, // Center horizontally
  },
  allStatusContainer: {
    marginTop: 150, // Center horizontally
  },
});
