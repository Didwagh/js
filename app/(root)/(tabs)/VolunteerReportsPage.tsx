import { getAllVolunteerReports, getDisasterById } from '@/lib/appwrite';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const VolunteerReportsPage: React.FC = () => {
  const [reports, setReports] = useState([]);
  const [groupedReports, setGroupedReports] = useState({});
  const [disasters, setDisasters] = useState({});
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getAllVolunteerReports();
      setReports(data);

      // Group reports by disasterId
      const grouped = data.reduce((acc, report) => {
        const { disasterId } = report;
        if (!acc[disasterId]) {
          acc[disasterId] = [];
        }
        acc[disasterId].push(report);
        return acc;
      }, {});
      setGroupedReports(grouped);

      // Fetch disaster titles
      const disasterTitles = {};
      for (let disasterId in grouped) {
        const disasterDoc = await getDisasterById(disasterId);
        disasterTitles[disasterId] = disasterDoc.title; // 👈 Extracting the title here
      }
      setDisasters(disasterTitles);
    } catch (err) {
      console.error('Failed to fetch volunteer reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const renderDisasterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.disasterCard}
      onPress={() => setSelectedDisaster(item)}
    >
      <Text style={styles.disasterText}>{disasters[item] || 'Loading Title...'}</Text>
      <Text style={styles.reportCount}>
        {groupedReports[item]?.length} Report{groupedReports[item]?.length > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.detail}>User ID: {item.userId}</Text>
      <Text style={styles.detail}>Service: {item.service}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Volunteer Reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedDisaster ? (
        <>
          <Text style={styles.header}>Disasters</Text>
          <FlatList
            data={Object.keys(groupedReports)}
            keyExtractor={(item) => item}
            renderItem={renderDisasterItem}
          />
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setSelectedDisaster(null)}>
            <Text style={styles.backButton}>← Back to Disasters</Text>
          </TouchableOpacity>
          <Text style={styles.header}>
            Reports for Disaster: {disasters[selectedDisaster] || 'Loading Title...'}
          </Text>
          <FlatList
            data={groupedReports[selectedDisaster]}
            keyExtractor={(item) => item.$id}
            renderItem={renderReportItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  disasterCard: {
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    marginBottom: 12,
  },
  disasterText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reportCount: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#007bff',
  },
  backButton: {
    color: '#007bff',
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default VolunteerReportsPage;
