import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map'; // Ensure the path is correct
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkSession } from '@/lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BucketStorage {
  latitude: string | null;
  longitude: string | null;
  state: string | null;
  district: string | null;
}

const Home = () => {
  const router = useRouter();
  const [bucketStorage, setBucketStorage] = useState<BucketStorage>({
    latitude: null,
    longitude: null,
    state: null,
    district: null,
  });

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const data = await AsyncStorage.getItem('locationData');
        if (data) {
          const parsedData = JSON.parse(data);
          setBucketStorage({
            latitude: parsedData.latitude || 'latitude not found',
            longitude: parsedData.longitude || 'longitude not found', // Corrected typo
            state: parsedData.state || 'State not found',
            district: parsedData.district || 'District not found',
          });
        }
      } catch (error) {
        console.error('Failed to load location data from AsyncStorage:', error);
      }
    };

    loadLocationData();
  }, []);

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
      <Text style={styles.text}>State: {bucketStorage.state}</Text>
      <Text style={styles.text}>District: {bucketStorage.district}</Text>
      <Text style={styles.text}>Latitude: {bucketStorage.latitude}</Text>
      <Text style={styles.text}>Longitude: {bucketStorage.longitude}</Text>
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
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default Home;
