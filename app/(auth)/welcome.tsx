import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";

const Welcome = () => {
  const { loading, isLogged, setIsLogged } = useGlobalContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set mounted to true when the component is ready
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
      router.push("/(auth)/sign-in"); // Redirect to sign-in page after logout
    } catch (error) {
      Alert.alert("Logout Failed", );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/welcome-image.png' }}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Disaster Relief Coordination</Text>
      <Text style={styles.description}>
        Helping you stay connected and informed during disaster relief efforts. Find safe places, report missing people, and get real-time updates.
      </Text>
      <View style={styles.rowContainer}>
        <Text style={styles.descriptions}>New here? Register below.</Text>
        <Text style={[styles.descriptions, { marginLeft: 30 }]}>Already have an account?</Text>
      </View>
      <View style={styles.rowButton}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePressLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePressLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  descriptions: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '40%',
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
});

export default Welcome;
