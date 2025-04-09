import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

const SOSVIEW = () => {
  const [sosRequests, setSosRequests] = useState<any[]>([]); // To store SOS requests
  const [isLoading, setIsLoading] = useState<boolean>(true); // To manage loading state

  useEffect(() => {
    // Fetch the SOS requests from the backend respective to the disaster report  and show marker to all the position
    const fetchSosRequests = async () => {
    
      try {
        const response = await fetch(
          "https://your-backend-api.com/sos-requests"
        );
        const data = await response.json();
        setSosRequests(data);
      } catch (error) {
        console.error("Error fetching SOS requests:", error);
        Alert.alert("Error", "Could not fetch SOS requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSosRequests();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text>Loading SOS Requests...</Text> 
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {sosRequests.map((request, index) => (
            <Marker
              key={index}
              coordinate={request.location}
              title={`SOS from User ${request.userId}`}
              description={request.message || "No description provided"} // Display message if available
              pinColor="red"
            />
          ))}
        </MapView>
      )}
    </View>
  );
};
export default SOSVIEW;
