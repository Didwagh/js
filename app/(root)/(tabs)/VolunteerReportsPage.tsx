import { getAllVolunteerReports, getDisasterById } from '@/lib/appwrite';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';

// Define types
type VolunteerReport = {
  $id: string;
  userId: string;
  service: string;
  disasterId: string;
};

type GroupedReports = {
  [disasterId: string]: VolunteerReport[];
};

type Disasters = {
  [disasterId: string]: string;
};

const VolunteerReportsPage: React.FC = () => {
  const [reports, setReports] = useState<VolunteerReport[]>([]);
  const [groupedReports, setGroupedReports] = useState<GroupedReports>({});
  const [disasters, setDisasters] = useState<Disasters>({});
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReports = async () => {
    try {
      const data: VolunteerReport[] = await getAllVolunteerReports();
      setReports(data);

      const grouped: GroupedReports = data.reduce((acc: GroupedReports, report: VolunteerReport) => {
        const { disasterId } = report;
        if (!acc[disasterId]) {
          acc[disasterId] = [];
        }
        acc[disasterId].push(report);
        return acc;
      }, {});
      setGroupedReports(grouped);

      const disasterTitles: Disasters = {};
      for (let disasterId in grouped) {
        const disasterDoc = await getDisasterById(disasterId);
        disasterTitles[disasterId] = disasterDoc.title || 'Unknown Title';
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

  const renderDisasterItem: ListRenderItem<string> = ({ item }) => (
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

  const renderReportItem: ListRenderItem<VolunteerReport> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.detail}>User ID: {item.userId}</Text>
      <Text style={styles.detail}>Service: {item.service}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 8 }}>Loading Volunteer Reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedDisaster ? (
        <>
          <Text style={styles.header}>Volunteer for Disasters</Text>
          <FlatList
            data={Object.keys(groupedReports)}
            keyExtractor={(item) => item}
            renderItem={renderDisasterItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No disasters to display at the moment.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <>
           
          <Text style={styles.header}>
            Volunteers for: {disasters[selectedDisaster] || 'Loading...'}
          </Text>
  
          <FlatList
            data={groupedReports[selectedDisaster]}
            keyExtractor={(item) => item.$id}
            renderItem={renderReportItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No volunteer reports for this disaster yet.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity onPress={() => setSelectedDisaster(null)} style={styles.backButtonContainer}>
            <Text style={styles.backButton}>← Back to Disasters</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F1F5F9',  // soft gray-blue
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',  // subtle gray text
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 25,
    color: '#1F2937',  // dark slate blue for header text
    textAlign: 'center',
  },
  disasterCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',  // very light border color
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  disasterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',  // dark text for readability
  },
  reportCount: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#3B82F6',  // sky-blue
    marginTop: 6,
  },
  backButtonContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  backButton: {
    color: '#2563EB',  // button text color
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  detail: {
    fontSize: 15,
    marginVertical: 6,
    color: '#374151',  // dark gray text
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6B7280',  // faded gray text for empty state
  },
});



export default VolunteerReportsPage;
