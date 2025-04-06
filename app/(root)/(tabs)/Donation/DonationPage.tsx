import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Requirement {
  id: string;
  type: string;
  required: number;
  received: number;
  description: string;
}
const DonationPage = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const navigation = useNavigation<any>();
  useEffect(() => {
    // Fetch from Appwrite or backend
    setRequirements([
      { id: '1', type: 'Food', required: 100, received: 40, description: 'Dry food kits needed urgently' },
      { id: '2', type: 'Clothes', required: 50, received: 10, description: 'Winter clothes needed for kids' },
    ]);
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={requirements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.type}>🧺 Type: {item.type}</Text>
          <Text style={styles.description}>📝 {item.description}</Text>
          <Text style={styles.details}>📦 Required: {item.required}</Text>
          <Text style={styles.details}>✅ Received: {item.received}</Text>
          <Text style={styles.details}>🔴 Remaining: {item.required - item.received}</Text>
          <View style={styles.button}>
            <Button
              title="Donate"
              color="#1e90ff"
              onPress={() => navigation.navigate('Donation/DonationForm', { requirement: item })}
            />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
  },
});

export default DonationPage;
