import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';
import DisasterNearMe from '@/components/DisasterMe';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BucketStorage {
  latitude: string | null;
  longitude: string | null;
  state: string | null;
  district: string | null;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  category?: string;
  labels?: string[];
  start: string;
  end: string;
  geo?: {
    geometry?: {
      coordinates?: [number, number];
    };
    address?: {
      city?: string;
      district?: string;
      country_code?: string;
    };
  };
  timezone?: string;
  state?: string;
}

// const API_KEY = 'HFEefhit2ZKqfj_IKjCrJU-07wG4_7R7tMJnrorz';
const API_KEY = 'RwGqA_Ogj2jVNF-eLAh8ruxqhmrW_IepZBGtbAJC';

const BASE_URL = 'https://api.predicthq.com/v1';

const Index: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null); // For pagination
  const [location, setLocation] = useState<string>(''); // Location input
  const [query, setQuery] = useState<string>(''); // Input for fetching events

  // Use theme colors
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');

  // BucketStorage
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
            longitude: parsedData.longitude || 'longitude not found',
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

  const fetchEvents = async (url: string) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      setEvents(prevEvents => [
        ...prevEvents,
        ...response.data.results.filter((event: Event) =>
          !prevEvents.some(e => e.id === event.id) &&
          event.category === 'disasters'
        )
      ]);

      setNextUrl(response.data.next || null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    if (!query) return;

    setLoading(true);
    setEvents([]);

    let url = `${BASE_URL}/events?q=${encodeURIComponent(query)}&limit=10&sort=start&category=disasters`;
    while (url) {
      await fetchEvents(url);
      url = nextUrl || "";
    }
  };

  useEffect(() => {
    if (query) {
      fetchAllEvents();
    }
  }, [query]);

  const handleSearch = () => {
    setQuery(location);
  };

  const loadMoreEvents = () => {
    if (nextUrl) {
      setLoading(true);
      fetchEvents(nextUrl);
    }
  };

  const handleEventsFetched = (newEvents: Event[]) => {
    setEvents(newEvents);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  const handleLoading = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput]}
          placeholder="Enter location (e.g., Mumbai, India)"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <DisasterNearMe
        onEventsFetched={handleEventsFetched}
        onError={handleError}
        onLoading={handleLoading}
        bucketStorage={bucketStorage}
      />
      {loading && !events.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.event]}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDetail}>Date: {item.start}</Text>
                  <Text style={styles.eventDetail}>Category: {item.category || 'Not available'}</Text>
                  {item.labels && item.labels.length > 0 && (
                    <Text style={styles.eventDetail}>Labels: {item.labels.join(', ')}</Text>
                  )}
                  {item.geo?.address?.city || item.geo?.address?.district ? (
                    <Text style={styles.eventDetail}>Location: {item.geo.address.city || item.geo.address.district}</Text>
                  ) : (
                    <Text style={styles.eventDetail}>Location: Not available</Text>
                  )}
                  {item.timezone && <Text style={styles.eventDetail}>Timezone: {item.timezone}</Text>}
                  {item.state && <Text style={styles.eventDetail}>Status: {item.state}</Text>}
                </View>
              )}
            />
          ) : (
            <Text style={styles.noEventsText}>No events found.</Text>
          )}
          {nextUrl && events.length >= 10 && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreEvents}>
              <Text style={styles.searchButtonText}>Load More</Text>
            </TouchableOpacity>          
          )}
        </>
      )}
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
    paddingVertical: 10,
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
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: '600',
  },
  event: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333',
    marginTop: 8,
    fontSize: 16,
  },
  noEventsText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  loadMoreButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default Index;
