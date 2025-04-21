import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";
import welcome from '@/assets/images/welcome.png';
const Welcome = () => {
  const { loading, isLogged, setIsLogged } = useGlobalContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (isLogged) {
        router.push("/(root)/(tabs)/home");
      }
    }
  }, [loading, isLogged, mounted, router]);

  const handlePress = () => {
    router.push("/(auth)/sign-up");
  };

  const handlePressLogin = () => {
    router.push("/(auth)/sign-in");
  };

  const handlePressLogout = async () => {
    try {
      await signOut();
      setIsLogged(false);
      Alert.alert("Logged Out", "You have successfully logged out.");
      router.push("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Logout Failed", (error as Error).message || "An unknown error occurred.");// Display error message
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={welcome}  // Correct way to load a local image
        style={styles.image} resizeMode="contain"
      />
      <Text style={styles.title}>Disaster Response and Relief Coordination</Text>
      <Text style={styles.description}>
        Stay connected and informed during disasters. Find safe havens, report missing people, and get real-time updates.
      </Text>

      <View style={styles.rowContainer}>
        <Text style={styles.descriptions}>New here? Register below.</Text>
        <Text style={[styles.descriptions, { marginLeft: 10 }]}>
          Already have an account?
        </Text>
      </View>

      <View style={styles.rowButton}>
        <TouchableOpacity style={styles.registerButton} onPress={handlePress}>
          <Text style={styles.buttonText}>📝 Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handlePressLogin}>
          <Text style={styles.buttonText}>🔑 Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E3F0F0',  // Light greyish blue background
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',  // Ensure image fits within bounds
    borderRadius: 15,  // Softer rounding for corners
    marginBottom: 20,
    shadowColor: '#000',  // Shadow for elevation effect
    shadowOffset: { width: 0, height: 5 },  // Subtle shadow offset
    shadowOpacity: 0.15,  // Soft shadow opacity
    shadowRadius: 10,  // Softer shadow radius
    elevation: 5,  // For Android devices to show shadow
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',  // Darker blue-grey for title
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',  // Soft grey for description text
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  descriptions: {
    fontSize: 13,
    color: '#34495E',  // Slightly darker blue-grey
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  registerButton: {
    backgroundColor: '#5DADE2',  // Light blue for register button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#5DADE2',  // Light blue for login button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Welcome;
