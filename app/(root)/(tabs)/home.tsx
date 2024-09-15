import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import Map from '@/components/Map'

const Home = () => {
  const router = useRouter();

  const handlePress = () => {
    router.navigate('/(root)/searchBar');  // Navigate to the Details page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>sign in </Text>
      <Map/>
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
