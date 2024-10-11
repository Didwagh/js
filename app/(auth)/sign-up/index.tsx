import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUser } from "@/lib/appwrite"; // Adjust the import path
import { useRouter } from 'expo-router';
import usePushNotification from '@/hooks/usePushNotification'; // Adjust the path to where you saved the hook

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  
  // Use the custom hook to get the push token
  const expoPushToken = usePushNotification();
  console.log(expoPushToken);

  const handleSignup = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Push notification token is required.");
      return;
    }

    try {
      const response = await createUser(email, password, name, expoPushToken); // Pass the token to createUser
      Alert.alert("Success", "User registered successfully! ID: " + response.$id);
      router.navigate('/(auth)/sign-in');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Registration failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default SignupPage;
