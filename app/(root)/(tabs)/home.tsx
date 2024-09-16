import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map';  // Ensure the path is correct
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const router = useRouter();

  const handlePress = () => {
    router.navigate('/(root)/searchBar');  
  };

  const handleSearchFocus = () => {
    router.navigate('/(root)/searchBar');  
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search"
          onFocus={handleSearchFocus}  
        />
        <Button title="Search" onPress={handlePress} />
      </View>
      <Text style={styles.text}>Home</Text>
      <SimpleMap />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',  // Align children horizontally
    alignItems: 'center',  // Center vertically
    marginBottom: 20,
    width: '100%',          // Ensure the container uses full width
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,               // Take up remaining space in the row
    marginRight: 10,       // Space between the input and button
    paddingHorizontal: 10,
  },
});

export default Home;
