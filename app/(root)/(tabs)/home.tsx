import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import SimpleMap from '@/components/Map';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider';
import AddressAlertModal from '@/components/AddressAlertModal';
import { getUsersWithTokens, sendPushNotification, updateUserLocation } from '@/lib/appwrite'; // Import the function to update user location

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onFocus={handleSearchFocus}
        />
        <Button title="Search" onPress={handlePress} />
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

      <Text style={styles.text}>State: {bucketStorage.state}</Text>
      <Text style={styles.text}>District: {bucketStorage.district}</Text>
      <Text style={styles.text}>City: {bucketStorage.city}</Text>
      <Text style={styles.text}>Latitude: {bucketStorage.latitude}</Text>
      <Text style={styles.text}>Longitude: {bucketStorage.longitude}</Text>
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
  userInfo: {
    marginBottom: 20,
  },
});

export default Home;
