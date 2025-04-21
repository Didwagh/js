import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { signOut } from "@/lib/appwrite";
import { router, useNavigation } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const Drawer = () => {
  const { setIsLogged } = useGlobalContext();
  // const router=useNavigation();
  const handlePress = (action: any) => {
    Alert.alert(`You clicked on: ${action} ${Dimensions.get("window").height}`);
  };
  const handleViewProfile = () => {
    // Alert.alert(`You clicked on: View Profile`);
    // router.navigate('/(root)/profile');
    router.push("/(root)/profile");
    // Alert.alert(`You clicked on: View Profile`);
  };
  const handleUpdateProfile = () => {
    Alert.alert(`You clicked on: Update Profile`);
    router.push("/(root)\\updateProfile");
  };
  const handleChangePassword = () => {
    Alert.alert(`You clicked on: change password`);
  };
  //   const handleLogout = () => {
  //     Alert.alert(`You clicked on: Logout`);
  //   };
  const handleLogout = async () => {
    try {
      await signOut();
      setIsLogged(false);
      Alert.alert("Logged Out", "You have successfully logged out.");
      router.push("/(auth)/sign-in");
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        (error as Error).message || "An unknown error occurred."
      ); // Display error message
    }
  };
  return (
    <View
      style={[styles.container, { height: Dimensions.get("window").height }]}
    >
      <View>
        <Text style={styles.title}>My Profile</Text>
  
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewProfile()}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateProfile()}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleChangePassword()}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity> */}
  
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress("Settings")}
        >
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => handleLogout()}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  };
  
  export default Drawer;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAF6FF", // Soft blue background
      padding: 25,
      justifyContent: "flex-start", // Align from the top
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20, // Small space below the title
      color: "#03045E", // Deep blue for contrast
      alignSelf: "flex-start", // Align to the left for a neat look
    },
    button: {
      backgroundColor: "#0077B6",
      paddingVertical: 14,
      paddingHorizontal: 25,
      borderRadius: 12,
      marginBottom: 18,
      width: "85%",
      alignSelf: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
    logoutButton: {
      backgroundColor: "#FF4D4D",
      shadowColor: "#FF0000",
    },
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });