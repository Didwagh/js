import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { Client, Databases, Models } from "react-native-appwrite"; 
import { getUnapprovedDisasterReports } from '@/lib/appwrite'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '@/context/GlobalProvider'; 
import { appwriteConfig } from '@/lib/appwrite'; 

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

interface DisasterReport extends Models.Document {
  title: string;
  video: string;
  city: string;
  district: string;
  approvedBy: string;
}

const DisasterReports = () => {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userCity, setUserCity] = useState<string | null>(null);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        const locationDataString = await AsyncStorage.getItem('locationData');
        if (locationDataString) {
          const locationData = JSON.parse(locationDataString);
          setUserCity(locationData.city);
        }
      } catch (error) {
        console.error('Failed to fetch user city:', error);
      }
    };

    fetchUserCity();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userCity) return;

      try {
        const data: Models.Document[] = await getUnapprovedDisasterReports(userCity);
        const mappedReports: DisasterReport[] = data.map((doc) => ({
          ...doc,
          title: doc.title || '',
          video: doc.video || '',
          city: doc.city || '',
          district: doc.district || '',
          approvedBy: doc.approvedBy || '',
        }));

        setReports(mappedReports);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load disaster reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userCity]);

  const updateReportApproval = async (reportId: string, approvedBy: string) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.disasterCollectionId,
        reportId,
        { approvedBy }
      );

      // Filter out the report from the state
      setReports((prevReports) =>
        prevReports.filter((report) => report.$id !== reportId)
      );

      Alert.alert('Success', approvedBy === 'rejected' ? 'Report rejected successfully.' : 'Report approved successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update report status');
    }
  };

  const handleApprove = (reportId: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to approve reports.');
      return;
    }
    updateReportApproval(reportId, user.$id);
  };

  const handleReject = (reportId: string) => {
    updateReportApproval(reportId, 'rejected');
  };

  const renderReport = ({ item }: { item: DisasterReport }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>City: {item.city}</Text>
      <Text>District: {item.district}</Text>
      <Text>Approved By: {item.approvedBy || 'Not approved'}</Text>
      <Text>Video: <Text style={styles.link}>{item.video}</Text></Text>
      <View style={styles.buttonContainer}>
        <Button title="Approve" onPress={() => handleApprove(item.$id)} />
        <Button title="Reject" onPress={() => handleReject(item.$id)} />
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={reports}
      renderItem={renderReport}
      keyExtractor={(item) => item.$id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text>No unapproved disaster reports found.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  reportContainer: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default DisasterReports;
