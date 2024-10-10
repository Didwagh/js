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
            city: geocodeData.address.city || geocodeData.address.town || 'City not found',
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
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading Map...</Text>
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
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default SimpleMap;
