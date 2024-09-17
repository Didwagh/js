import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = 'HFEefhit2ZKqfj_IKjCrJU-07wG4_7R7tMJnrorz';
const BASE_URL = 'https://api.predicthq.com/v1';

interface DisasterNearMeProps {
  onEventsFetched: (events: any[]) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  bucketStorage: {
    state: string | null;
  };
}

const DisasterNearMe: React.FC<DisasterNearMeProps> = ({ onEventsFetched, onError, onLoading, bucketStorage }) => {
  const fetchDisastersNearMe = async () => {
    onLoading(true);

    try {
      const data = await AsyncStorage.getItem('locationData');
      if (data) {
        const parsedData = JSON.parse(data);
        const district = parsedData.state || '';

        const url = `${BASE_URL}/events?q=${encodeURIComponent(district)}&limit=10&sort=start&category=disasters`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        onEventsFetched(response.data.results);
      }
    } catch (error) {
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Disaster Near Me" onPress={fetchDisastersNearMe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default DisasterNearMe;
