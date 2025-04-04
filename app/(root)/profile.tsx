import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import SimpleMap from "@/components/Map";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
import AddressAlertModal from "@/components/AddressAlertModal";
import {
  getUsersWithTokens,
  sendPushNotification,
  updateUserLocation,
} from "@/lib/appwrite"; // Import the function to update user location
import { Ionicons } from "@expo/vector-icons";
// import Navbar from "@/components/Navbar";

interface BucketStorage {
  latitude: string | null;
  longitude: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
}

const Profile = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [bucketStorage, setBucketStorage] = useState<BucketStorage>({
    latitude: null,
    longitude: null,
    state: null,
    district: null,
    city: null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const data = await AsyncStorage.getItem("locationData");
        if (data) {
          const parsedData = JSON.parse(data);
          setBucketStorage({
            latitude: parsedData.latitude || "latitude not found",
            longitude: parsedData.longitude || "longitude not found",
            state: parsedData.state || "State not found",
            district: parsedData.district || "District not found",
            city: parsedData.city || "City not found",
          });
        }
      } catch (error) {
        console.error("Failed to load location data from AsyncStorage:", error);
      }
    };

    loadLocationData();

    // Check for user district and show modal if empty
    if (user && user.district === "") {
      setModalVisible(true);
    }
  }, [user]);

  const handlePress = () => {
    router.navigate("/(root)/searchBar");
  };

  const handleSearchFocus = () => {
    router.navigate("/(root)/searchBar");
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <View>
          <View style={styles.userInfo}>
            <Text style={styles.text}>Name: {user.username}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>District: {user.district}</Text>
            <Text style={styles.text}>City: {user.city}</Text>
            <Text style={styles.text}>State: {bucketStorage.state}</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={()=>router.push('/(root)\\updateProfile')}>
              <Text style={styles.btnText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.text}>No user logged in</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
 
  infoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "#555",
  },
  userInfo: {
    marginBottom: 20,
  },
  btnContainer: {
    marginVertical: 10,
  },
  btn: {
    backgroundColor: "#007BFF",
    width:'40%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
    // color: "white",
  },
  btnText:{
    color:"white",
    paddingHorizontal:7,
    paddingVertical:10,
    fontSize:15,

  }
});

export default Profile;
