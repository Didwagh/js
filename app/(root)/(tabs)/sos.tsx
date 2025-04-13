import React, { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome } from "@expo/vector-icons";
import { getUsersWithTokens } from "@/lib/appwrite";
import { sendPushNotification } from "@/lib/appwrite"; // ✅ Make sure this path is correct
import axios from "axios";


const SOS = () => {
  const { user } = useGlobalContext();

  const [region, setRegion] = useState<any>(null);


  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [flagColor, setFlagColor] = useState("green");

  // 🧭 To store geocoded location
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setLocationPermissionGranted(true);

        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        // 🌍 Reverse geocode location
        // const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      //   if (address.length > 0) {
      //     const { city, district } = address[0];
      //     setCity(city?city:"");
      //     setDistrict(district?district:"");
      //     console.log("📍 Location Info:");
      //     console.log("City:", city);
      //     console.log("District:", district);
      //   }
      // } else {
      //   Alert.alert("Permission Denied", "We need location permission to continue.");
      // }





      const reverseGeocode = async (latitude: number, longitude: number) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        console.log(url);
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'js' 
            }
          });
          return response.data;
        } catch (error) {
          console.log("reverse geo code error");
          console.error(error);
          return null;
        }
      };
      

      const geocodeData = await reverseGeocode(latitude, longitude);

      if (geocodeData) {
        setDistrict(geocodeData.address.state_district);
        setCity(geocodeData.address.city)
      }
    

    };
  }

    requestLocationPermission();
  }, []);

  const handleSOSRequest = async () => {
    if (!region) {
      Alert.alert("Error", "Location not found. Please try again.");
      return;
    }

    try {
      await getUsersWithTokens(city,district); 
    } catch (error) {
      console.error("Failed to send notifications:", error);
    }
   



   

    

      
  };

  return (
    <View style={{ flex: 1 }}>
      {region ? (
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={() => {}}
        >
          <Marker
            coordinate={region}
            title="Your Location"
            description="Requesting Help"
          />
        </MapView>
      ) : (
        <Text>Loading your location...</Text>
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          backgroundColor: flagColor,
          padding: 12,
          borderRadius: 50,
        }}
        onPress={handleSOSRequest}
      >
        <FontAwesome name="flag" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SOS;
