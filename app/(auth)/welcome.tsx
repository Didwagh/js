import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/(auth)/sign-up"); // Navigate to the Details page
  };

  const handlePresslogin = () => {
    router.push("/(auth)/sign-in"); // Navigate to the Details page
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://example.com/welcome-image.png' }} // Add your own image URL or local asset
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
    
        <TouchableOpacity style={styles.loginButton} onPress={handlePresslogin}>
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
    // alignItems: 'center',
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


export default welcome;
