import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const SignIn = () => {
  const router = useRouter();
  const handlePress = () => {
    router.navigate('/(root)/(tabs)/home');  
  };
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#ccc"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            autoCapitalize="none" 
            keyboardType="email-address"
          />
        </View>
      
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity >

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '80%',
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 20,
    color: '#333', 
    marginBottom: 20,
    textAlign: 'center', 
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    padding: 5,
  },
  buttonContainer: {
    width: '50%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignIn;