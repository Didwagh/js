import React, { useEffect, useState } from "react";
import {View,Text,Button,TextInput,Alert,TouchableOpacity} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; 
import { useGlobalContext } from "@/context/GlobalProvider"; 
import { FontAwesome } from "@expo/vector-icons";

const SOS = () => {
  const { user } = useGlobalContext(); // User info to check role and send request
  const [region, setRegion] = useState<any>(null); // Store the current region (location)
  // const [sosMessage, setSosMessage] = useState(""); // The SOS message the user wants to send
  const [locationPermissionGranted, setLocationPermissionGranted] =useState(false);
  const [flagColor, setFlagColor] = useState("green")
  useEffect(() => {
    // Request location permission when the component mounts
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
      } else {
        Alert.alert(
          "Permission Denied",
          "We need location permission to continue."
        );
      }
    };

    requestLocationPermission();

    // Get the user's current location after permission is granted
    if (locationPermissionGranted) {
      Location.getCurrentPositionAsync({})
        .then((position) => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        })
        .catch((error) => {
          Alert.alert("Error", "Could not get your location.");
        });
    }
  }, [locationPermissionGranted]); // Only run once location permission is granted

  const handleSOSRequest = () => {
    if (!region) {
      Alert.alert("Error", "Please provide a  and your location.");
      return;
    }

    // Make a request to your backend to save the SOS request.
    // Example: sending SOS request to a backend API.
    const sosData = {
      userId: user.id,
      // reportId:report.id //id of the ongoing disaster
      location: region,
    };
    setFlagColor(flagColor === "green" ?"red":"green");
    if(flagColor === "green"){
      // add request to the backend with ongoing disaster report id
      // fetch("https://your-backend-api.com/sos", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(sosData),
      // })
      //   .then((res) => res.json())
      //   .then((response) => {
      //     Alert.alert("SOS Sent", "Your request has been sent for help.");
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     Alert.alert(
      //       "Error",
      //       "Something went wrong while sending your SOS request."
      //     );
      //   });
      Alert.alert("SOS Request Sent", "Your request has been sent for help.");
    }else{
      //delete Sos Request
      Alert.alert("SOS Request Deleted", "Your request has been deleted");
    }
  }
  // create an route to delete all sos request with the ongoing disaster using reportid on the status updated to completed
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
          // backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundColor: flagColor,
          padding: 10,
          borderRadius: 50,
        }}
        onPress={handleSOSRequest}
      >
        {/* <FontAwesome name="map-marker" size={30} color="#fff" /> */}
        <FontAwesome name="flag" size={30} color="#fff"/>
      </TouchableOpacity>
    </View>
  );
};

export default SOS;

// import React, { useEffect, useState } from "react";
// import { View, Text, Button, TextInput, Alert } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location"; // Import expo-location
// import { useGlobalContext } from "@/context/GlobalProvider"; // Assuming you're using context for user data

// const SOS = () => {
//   const { user } = useGlobalContext(); // User info to check role and send request
//   const [region, setRegion] = useState<any>(null); // Store the current region (location)
//   const [sosMessage, setSosMessage] = useState(""); // The SOS message the user wants to send
//   const [locationPermissionGranted, setLocationPermissionGranted] =
//     useState(false);

//   useEffect(() => {
//     // Request location permission when the component mounts
//     const requestLocationPermission = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === "granted") {
//         setLocationPermissionGranted(true);
//       } else {
//         Alert.alert(
//           "Permission Denied",
//           "We need location permission to continue."
//         );
//       }
//     };

//     requestLocationPermission();

//     // Get the user's current location after permission is granted
//     if (locationPermissionGranted) {
//       Location.getCurrentPositionAsync({})
//         .then((position) => {
//           const { latitude, longitude } = position.coords;
//           setRegion({
//             latitude,
//             longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           });
//         })
//         .catch((error) => {
//           Alert.alert("Error", "Could not get your location.");
//         });
//     }
//   }, [locationPermissionGranted]); // Only run once location permission is granted

//   const handleSOSRequest = () => {
//     if (!sosMessage || !region) {
//       Alert.alert("Error", "Please provide a message and your location.");
//       return;
//     }

//     // Make a request to your backend to save the SOS request.
//     // Example: sending SOS request to a backend API.
//     const sosData = {
//       userId: user.id,
//       message: sosMessage,
//       location: region,
//     };

//     fetch("https://your-backend-api.com/sos", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(sosData),
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         Alert.alert("SOS Sent", "Your request has been sent for help.");
//       })
//       .catch((error) => {
//         console.error(error);
//         Alert.alert(
//           "Error",
//           "Something went wrong while sending your SOS request."
//         );
//       });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ fontSize: 24, margin: 20 }}>Request Help (SOS)</Text>
//       {region ? (
//         <MapView
//           style={{ flex: 1 }}
//           region={region}
//           onRegionChangeComplete={setRegion}
//         >
//           <Marker
//             coordinate={region}
//             title="Your Location"
//             description="Requesting Help"
//           />
//         </MapView>
//       ) : (
//         <Text>Loading your location...</Text>
//       )}
//       <TextInput
//         placeholder="Describe your situation"
//         value={sosMessage}
//         onChangeText={setSosMessage}
//         style={{ padding: 10, borderWidth: 1, marginBottom: 20 }}
//       />
//       <Button title="Send SOS" onPress={handleSOSRequest} />
//     </View>
//   );
// };

// export default SOS;
