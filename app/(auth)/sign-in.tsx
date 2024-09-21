import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

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
      <Text style={styles.text}>sign in </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={"gray"}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor={"gray"}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <Button title="Login " onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#282c34",
  },
  text: {
    fontSize: 20,
    color: "gray",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "white",
    width: "80%",
  },
});

export default SignIn;