import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map'; // Ensure the path is correct
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
        <TouchableOpacity style={styles.searchButton} onPress={handlePress}>
          {/* <Text style={styles.searchButtonText}>Search</Text> */}
          <Ionicons name="search-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          placeholderTextColor="#888"
          onFocus={handleSearchFocus}
        />
        
      </View>
      {/* <Text style={styles.text}>State: {bucketStorage.state}</Text>
      <Text style={styles.text}>District: {bucketStorage.district}</Text>
      <Text style={styles.text}>Latitude: {bucketStorage.latitude}</Text>
      <Text style={styles.text}>Longitude: {bucketStorage.longitude}</Text> */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>State: </Text>
        <Text style={styles.text}>{bucketStorage.state}</Text>
        <Text style={styles.label}>District: </Text>
        <Text style={styles.text}>{bucketStorage.district}</Text>
        <Text style={styles.label}>Latitude: </Text>
        <Text style={styles.text}>{bucketStorage.latitude}</Text>
        <Text style={styles.label}>Longitude: </Text>
        <Text style={styles.text}>{bucketStorage.longitude}</Text>
      </View>
      <SimpleMap />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
    width: '100%',
    backgroundColor: '#fff', 
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  searchButton: {
    // backgroundColor: '#4CAF50', 
    // paddingVertical: 10,
    // paddingHorizontal: 1,
    borderRadius: 8,
    // marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff', 
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: 'flex-start', 
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333', 
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: '#555', 
  },
});

export default Home;
