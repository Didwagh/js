import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import AddressAlertModal from '@/components/AddressAlertModal';
import { getUsersWithTokens, sendPushNotification, updateUserLocation } from '@/lib/appwrite'; // Import the function to update user location
import { Ionicons } from '@expo/vector-icons';
// import Navbar from '@/components/Navbar';

interface BucketStorage {
  latitude: string | null;
  longitude: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
}

const Home = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [bucketStorage, setBucketStorage] = useState<BucketStorage>({
    latitude: null,
    longitude: null,
    state: null,
    district: null,
    city: null,
  });
  const [modalVisible, setModalVisible] = useState(false);



  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const data = await AsyncStorage.getItem('locationData');
        if (data) {
          const parsedData = JSON.parse(data);
          setBucketStorage({
            latitude: parsedData.latitude || 'latitude not found',
            longitude: parsedData.longitude || 'longitude not found',
            state: parsedData.state || 'State not found',
            district: parsedData.district || 'District not found',
            city: parsedData.city || 'City not found',
          });
        }
      } catch (error) {
        console.error('Failed to load location data from AsyncStorage:', error);
      }
    };

    loadLocationData();

    // Check for user district and show modal if empty
    if (user && user.district === "") {
      setModalVisible(true);
    }
  }, [user]);

  const handlePress = () => {
    router.navigate('/(root)/searchBar');
  };

  const handleSearchFocus = () => {
    router.navigate('/(root)/searchBar');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const setHomeAddress = async () => {
    try {
      const locationData = await AsyncStorage.getItem('locationData');
      const parsedLocationData = locationData ? JSON.parse(locationData) : null;
  
      const currentLocation = {
        latitude: bucketStorage.latitude,
        longitude: bucketStorage.longitude,
        state: bucketStorage.state,
        district: parsedLocationData?.district || '',
        city: parsedLocationData?.city || '',
      };
  
      await AsyncStorage.setItem('homeAddress', JSON.stringify(currentLocation));
      alert('Home address set successfully!');
  
      // Update user location in the database
      await updateUserLocation({
        city: currentLocation.city,
        district: currentLocation.district,
      });
    } catch (error) {
      console.error('Failed to set home address:', error);
    }
    closeModal();
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* <Navbar/> */}
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

      {/* Display user information if available */}
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.text}>Name: {user.username}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>District: {user.district}</Text>
          <Text style={styles.text}>City: {user.city}</Text>
        </View>
      ) : (
        <Text style={styles.text}>No user logged in</Text>
      )}

      {/* <Text style={styles.text}>State: {bucketStorage.state}</Text>
      <Text style={styles.text}>District: {bucketStorage.district}</Text>
      <Text style={styles.text}>City: {bucketStorage.city}</Text>
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

      {/* Use the AddressAlertModal component */}
      <AddressAlertModal 
        visible={modalVisible} 
        onClose={closeModal} 
        onSetHomeAddress={setHomeAddress} 
      />
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
  userInfo: {
    marginBottom: 20,
  },
});

export default Home;
