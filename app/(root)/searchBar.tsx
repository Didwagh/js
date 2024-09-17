import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput, ActivityIndicator } from 'react-native';
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

const API_KEY = 'HFEefhit2ZKqfj_IKjCrJU-07wG4_7R7tMJnrorz';
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
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { borderColor: textColor, color: textColor }]}
          placeholder="Enter location (e.g., Mumbai, India)"
          placeholderTextColor={textColor}
          value={location}
          onChangeText={setLocation}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <DisasterNearMe
        onEventsFetched={handleEventsFetched}
        onError={handleError}
        onLoading={handleLoading}
        bucketStorage={bucketStorage}
      />
      {loading && !events.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={{ color: textColor, marginTop: 8 }}>Loading...</Text>
        </View>
      ) : (
        <>
          {events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.event, { backgroundColor: textColor }]}>
                  <Text style={{ color: backgroundColor }}>{item.title}</Text>
                  <Text style={{ color: backgroundColor }}>Date: {item.start}</Text>
                  <Text style={{ color: backgroundColor }}>Category: {item.category || 'Not available'}</Text>
                  {item.labels && item.labels.length > 0 && (
                    <Text style={{ color: backgroundColor }}>Labels: {item.labels.join(', ')}</Text>
                  )}
                  {item.geo?.address?.city || item.geo?.address?.district ? (
                    <Text style={{ color: backgroundColor }}>Location: {item.geo.address.city || item.geo.address.district}</Text>
                  ) : (
                    <Text style={{ color: backgroundColor }}>Location: Not available</Text>
                  )}
                  {item.timezone && <Text style={{ color: backgroundColor }}>Timezone: {item.timezone}</Text>}
                  {item.state && <Text style={{ color: backgroundColor }}>Status: {item.state}</Text>}
                </View>
              )}
            />
          ) : (
            <Text style={{ color: textColor }}>No events found.</Text>
          )}
          {nextUrl && events.length >= 10 && (
            <Button title="Load More" onPress={loadMoreEvents} />
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  event: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;
