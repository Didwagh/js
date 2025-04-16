import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { updateUserLocation } from '@/lib/appwrite';
import { useGlobalContext } from "@/context/GlobalProvider";

interface LocationType {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
}


const SimpleMap = () => {
    const { user } = useGlobalContext();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   if(user.city !== null){
    const fetchAndStoreLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const reverseGeocode = async (latitude: number, longitude: number) => {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
          try {
            const response = await axios.get(url, {
              headers: {
                'User-Agent': 'MyApp/1.0 (myemail@example.com)',
              },
            });
            return response.data;
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return null;
          }
        };

        const geocodeData = await reverseGeocode(coords.latitude, coords.longitude);

        if (geocodeData) {
          const locationData: LocationType = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            city: geocodeData.address.city || geocodeData.address.town || 'Unknown City',
            district: geocodeData.address.state_district || 'Unknown District',
          };

          setLocation(locationData);

          // Save to backend
          await updateUserLocation(locationData);
        } else {
          setErrorMsg('Failed to retrieve address details.');
        }
      } catch (error) {
        console.error(error);
        setErrorMsg('Error while fetching your location');
      } finally {
        setLoading(false);
      }
    };
    fetchAndStoreLocation();
   }

  }, []);

  const initialRegion = {
    latitude: location?.latitude || 37.78825,
    longitude: location?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
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
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>Latitude: {location?.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {location?.longitude}</Text>
            <Text style={styles.locationText}>City: {location?.city}</Text>
            <Text style={styles.locationText}>District: {location?.district}</Text>
          </View>
        </>
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
    borderRadius: 8,
    justifyContent: 'center',
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  locationContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default SimpleMap;
