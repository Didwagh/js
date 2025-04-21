// SignIn.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "@/lib/appwrite"; // Adjust the import path accordingly
import { useGlobalContext } from "@/context/GlobalProvider";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { refetchUser } = useGlobalContext();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handlePress = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      await signIn(formData.email, formData.password);
      await refetchUser(); // refresh global context with new user
      Alert.alert("Success", "You have logged in successfully!");
      router.navigate("/(root)/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
  
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#A3B8C9"
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
  
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#A3B8C9"
          value={formData.password}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>
  
      <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
  
      <Text style={styles.registerText}>
        Don't have an account?
        <Text
          style={styles.registerLink}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          Register here
        </Text>
      </Text>
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#F0F9FF",  // Light blue background
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#2D3748",  // Dark grey text for title
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#B0C4DE",  // Light steel blue border
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      width: "80%",
      backgroundColor: "#FFFFFF",
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
      color: "#2D3748",  // Dark text for input
      padding: 5,
      fontSize: 16,
    },
    buttonContainer: {
      width: "60%",
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: "#4183D7",  // Blue button
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
    },
    buttonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
    },
    registerText: {
      fontSize: 16,
      color: "#2D3748",
      fontWeight: "bold",
      textAlign: "center",
    },
    registerLink: {
      color: "#4183D7",  // Blue color for the link
      fontWeight: "bold",
    },
  });

export default SignIn;
