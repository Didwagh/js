import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDisastersByLocation } from '@/lib/appwrite'; // Adjust the import path
import { useRouter } from 'expo-router';

interface Disaster {
  $id: string;
  title: string;
  description: string;
  city: string;
  district: string;
  disasterType?: string;
  video?: string;
}

const DisasterReportsPage: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const disasterReports: Disaster[] = await getDisastersByLocation();
        setDisasters(disasterReports);
      } catch (error) {
        console.error("Error fetching disaster reports:", error);
        Alert.alert("Error", "Unable to fetch disaster reports. Please try again later.");
      }
    };

    fetchDisasters();
  }, []);

  const renderDisasterItem = ({ item }: { item: Disaster }) => (
    <TouchableOpacity onPress={() => showDisasterDetails(item)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{item.city}, {item.district}</Text>
      </View>
    </TouchableOpacity>
  );

  const showDisasterDetails = (item: Disaster) => {
    Alert.alert(
      item.title,
      `Description: ${item.description}\nCity: ${item.city}\nDistrict: ${item.district}\nType: ${item.disasterType || "N/A"}\nVideo: ${item.video || "N/A"}`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disaster Reports</Text>
      <FlatList
        data={disasters}
        renderItem={renderDisasterItem}
        keyExtractor={(item) => item.$id}
        // showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginTop: 30,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default DisasterReportsPage;
