import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(auth)/sign-in');  // Navigate to the Details page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>signup</Text>
      <Button title="Go to Details" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Home;
