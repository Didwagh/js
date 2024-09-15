import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map';  // Ensure the path is correct

const Home = () => {
  const router = useRouter();

  const handlePress = () => {
    router.navigate('/(root)/searchBar');  // Navigate to the searchBar page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In</Text>
      <SimpleMap />
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
