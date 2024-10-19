import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker'; 
import { createUser } from "@/lib/appwrite"; // Adjust the import path
import { useRouter } from 'expo-router';
import usePushNotification from '@/hooks/usePushNotification'; // Adjust the path to where you saved the hook
import * as FileSystem from 'expo-file-system'; // Import FileSystem for file operations

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("User"); // Default selection
  const [idProofUri, setIdProofUri] = useState<string | null>(null); // State for ID proof
  const [idProofFile, setIdProofFile] = useState<any>(null); // State to hold ID proof file details
  const router = useRouter();
  
  const expoPushToken = usePushNotification();
  console.log(expoPushToken);

  const handleSignup = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Push notification token is required.");
      return;
    }

    try {
      // You might want to upload the ID proof file here
      const response = await createUser(email, password, name, expoPushToken, userType, idProofUri); // Pass idProofUri
      Alert.alert("Success", "User registered successfully! ID: " + response.$id);
      router.navigate('/(root)/(tabs)/home');  

    } catch (error: any) {
      Alert.alert("Error", error.message || "Registration failed!");
    }
  };

  const pickIdProof = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });

      if (result.assets && result.assets.length > 0) {
        const { uri, name } = result.assets[0]; 
        setIdProofUri(uri);
        setIdProofFile({ uri, name });
      } else {
        Alert.alert('No document selected');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error picking document');
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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => {
            setUserType(itemValue);
            if (itemValue === "User") {
              setIdProofUri(null); // Clear ID proof if "User" is selected
              setIdProofFile(null); // Clear ID proof file details
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="User" value="User" />
          <Picker.Item label="NGO" value="NGO" />
          <Picker.Item label="Volunteer" value="Volunteer" />
        </Picker>
      </View>

      {/* Conditionally render the ID proof picker */}
      {userType !== "User" && (
        <View>
          <TouchableOpacity style={styles.idProofButton} onPress={pickIdProof}>
            <Text style={styles.buttonText}>Upload ID Proof</Text>
          </TouchableOpacity>
          {idProofUri && (
            <View style={styles.imageContainer}>
              <Text style={styles.idProofText}>Selected ID Proof:</Text>
              <Image source={{ uri: idProofUri }} style={styles.idProofImage} />
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: "center",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 10,
    width: '100%',
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  button: {
    backgroundColor: '#4169E1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  idProofButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  idProofText: {
    marginTop: 10,
    color: '#333',
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  idProofImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 5,
    resizeMode: 'cover',
  },
});

export default SignupPage;
