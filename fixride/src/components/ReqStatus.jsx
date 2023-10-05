import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/firebase";

export default function ReqStatus(props) {
  const [currentStatus, setCurrentStatus] = useState("Pending");
  const [RequestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [startStatus, setStartStatus] = useState("");
  const [reachStatus, setReachStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [doneStatus, setDoneStatus] = useState("");
  const [assignStatus, setAssignStatus] = useState("");

  const statuses = ["Approved", "Started", "Reached", "Done"];

  const bwcorrect = require("../../assets/bwcorrect.png");
  const colorCorrect = require("../../assets/correctcol.png");

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
      <View style={styles.statusContainer}>
        {currentStatus === "Approved" ? (
          <Image source={colorCorrect} style={styles.statusImage} />
        ) : (
          <Image source={bwcorrect} style={styles.statusImage} />
        )}
        <Text style={styles.statusText}>Approved</Text>
      </View>
      <VerticalLine isGreen={currentStatus === "Approved"} />
      <View style={styles.statusContainer}>
        {assignStatus === "Assigned" ? (
          <Image source={colorCorrect} style={styles.statusImage} />
        ) : (
          <Image source={bwcorrect} style={styles.statusImage} />
        )}
        <Text style={styles.statusText}>Assigned</Text>
      </View>
      <VerticalLine isGreen={assignStatus === "Assigned"} />
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
  },
  statusImage: {
    width: 24, // Adjust the width as needed
    height: 24, // Adjust the height as needed
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
  },
  verticalLine: {
    width: 1,
    height: "10%",
    backgroundColor: "gray", // Adjust the color as needed
    marginLeft: 10,
    marginRight: 10,
  },
  greenVerticalLine: {
    backgroundColor: "green", // Change the color to green
  },
});
