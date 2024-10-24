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
        source={{ uri: 'https://example.com/welcome-image.png' }}
        style={styles.image}
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

        <TouchableOpacity style={styles.loginButton} onPress={handlePressLogout}>
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
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
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
    lineHeight: 20,
  },
  descriptions: {
    fontSize: 13,
    color: '#333',
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
    backgroundColor: '#4169E1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#4169E1',
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
