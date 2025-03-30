import {Alert,Dimensions,StyleSheet,Text,TouchableOpacity,View,} from "react-native";
import React from "react";
import { signOut } from "@/lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const Drawer = () => {
  const { setIsLogged } = useGlobalContext();
  const handlePress = (action: any) => {
    Alert.alert(`You clicked on: ${action} ${Dimensions.get("window").height}`);
  };
  const handleViewProfile = () => {
    Alert.alert(`You clicked on: View Profile`);
  };
  const handleUpdateProfile = () => {
    Alert.alert(`You clicked on: Update Profile`);
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
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewProfile()}
        >
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
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
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress("Settings")}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleLogout()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
