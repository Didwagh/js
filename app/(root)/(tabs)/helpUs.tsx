import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDisastersByLocation } from '@/lib/appwrite'; // Adjust the import path
import { useLocalSearchParams, useRouter } from 'expo-router';

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
  const { refresh } = useLocalSearchParams(); 
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
  }, [refresh]); //

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
    router.push({
      pathname: '/details', // Adjust the path to your details page
      params: {
        id: item.$id,
        title: item.title,
        description: item.description || "No description available",
        city: item.city,
        district: item.district,
        disasterType: item.disasterType || "N/A",
        video: item.video || "N/A",
      },
    });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disaster Reports</Text>
      <FlatList
        data={disasters}
        renderItem={renderDisasterItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#EAF6FF', // light blue background
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0077B6',  // deep ocean blue for the header
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#FFFFFF',  // keep cards white for contrast
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Android shadow
    borderLeftWidth: 5,
    borderLeftColor: '#00B4D8',  // vibrant light blue accent on the card side
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0077B6',  // matching the header blue
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default DisasterReportsPage;
