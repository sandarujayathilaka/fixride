import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../src/config/firebase";
import { useGlobalSearchParams } from "expo-router";

export default function ReqStatus() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = ["Pending", "Approved", "Started", "Reached", "Done"];
   const params = useGlobalSearchParams();
   const Id = params.id;

  useEffect(() => {
    setLoading(true);
    const usersQuery = query(
      collection(db, "request"),
      where("username", "==", Id) // Replace with your actual query
    );
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestUser = snapshot.docs[0].data();
        setCurrentStatus(latestUser.status);
      }
      setLoading(false);
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    if (status === currentStatus) {
      return "orange";
    } else if (
      status === "Pending" ||
      status === "Approved" ||
      status === "Started" ||
      status === "Reached"||
      status === "Done"
    ) {
      return "gray";
    } else {
      return "gray";
    }
  };

  return (
    <View>
      {statuses.map((status, index) => (
        <View
          key={index}
          style={{
            backgroundColor: getStatusColor(status),
          }}
        >
          <Text>{status}</Text>
        </View>
      ))}
    </View>
  );
}
