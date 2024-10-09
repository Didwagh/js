import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationType {
  latitude: number;
  longitude: number;
}

const SimpleMap = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const reverseGeocode = async (latitude: number, longitude: number) => {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
          try {
            const response = await axios.get(url);
            return response.data;
          } catch (error) {
            console.error(error);
            return null;
          }
        };

        const geocodeData = await reverseGeocode(coords.latitude, coords.longitude);

        if (geocodeData) {
          const locationData = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            state: geocodeData.address.state || 'State not found',
            district: geocodeData.address.state_district || 'District not found',
          };

          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          // Store data in AsyncStorage
          await AsyncStorage.setItem('locationData', JSON.stringify(locationData));
        }
      } catch (error) {
        setErrorMsg('Error fetching location');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const initialRegion = {
    latitude: location ? location.latitude : 37.78825,
    longitude: location ? location.longitude : -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading Map...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {location && (
            <Marker
              coordinate={location}
              title="You are here"
            />
          )}
        </MapView>
      )}
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
        </View>
      )}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
    padding: 10, 
    justifyContent: 'center',
    borderRadius: 8,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
    padding: 20,
    borderRadius: 8,
  },
  loadingText: {
    color: '#007bff', 
    fontSize: 18,
    marginTop: 10,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  locationContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    color: '#333', 
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SimpleMap;
