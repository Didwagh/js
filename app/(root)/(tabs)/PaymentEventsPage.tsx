import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllPaymentEvents } from '@/lib/appwrite'; // Assuming this function is implemented
import { useNavigation } from '@react-navigation/native';
import { getDisasterById } from '@/lib/appwrite'; // Import the getDisasterById function

// Type definition for Payment Event
interface PaymentEvent {
  $id: string;
  userId: string;
  disasterId: string;
  Amount: number;
  $createdAt: string; // Date string from Appwrite
}

interface DisasterGroupedEvents {
  disasterId: string;
  disasterTitle: string; // Add disasterTitle field
  events: PaymentEvent[];
}

const PaymentEventsPage: React.FC = () => {
  const [paymentEvents, setPaymentEvents] = useState<PaymentEvent[]>([]);
  const [groupedDisasters, setGroupedDisasters] = useState<DisasterGroupedEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation(); // For navigation

  useEffect(() => {
    const fetchPaymentEvents = async () => {
      try {
        const events = await getAllPaymentEvents();
        setPaymentEvents(events);
        await groupEventsByDisaster(events); // Group events by disaster
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to load payment events');
        setLoading(false); // Set loading to false on error
      }
    };

    fetchPaymentEvents();
  }, []);

  // Group payment events by disasterId and fetch the disasterTitle
  const groupEventsByDisaster = async (events: PaymentEvent[]) => {
    const grouped: DisasterGroupedEvents[] = [];

    for (const event of events) {
      let disasterGroup = grouped.find(group => group.disasterId === event.disasterId);

      if (!disasterGroup) {
        // Fetch the disaster title using the disasterId
        try {
          const disasterDoc = await getDisasterById(event.disasterId);
          const disasterTitle = disasterDoc.title && typeof disasterDoc.title === 'string' ? disasterDoc.title : "Unknown Disaster"; // Default title if null

          disasterGroup = {
            disasterId: event.disasterId,
            disasterTitle, // Add the disaster title or fallback
            events: [],
          };

          grouped.push(disasterGroup);
        } catch (err) {
          console.error("Error fetching disaster title:", err);
          // Handle the case when disaster document fetch fails
          disasterGroup = {
            disasterId: event.disasterId,
            disasterTitle: "Unknown Disaster", // Fallback if disaster fetch fails
            events: [],
          };
          grouped.push(disasterGroup);
        }
      }

      if (disasterGroup) {
        disasterGroup.events.push(event);
      }
    }

    setGroupedDisasters(grouped);
  };

  // If loading, show a loading spinner
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading Data...</Text>
      </View>
    );
  }
  
  // If there's an error, display an error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Oops! Something went wrong: {error}</Text>
      </View>
    );
  }

  // Render each disaster (group of payment events)
  const renderDisaster = ({ item }: { item: DisasterGroupedEvents }) => (
    <View style={styles.disasterContainer}>
      <TouchableOpacity
        style={styles.disasterItem}
        onPress={() => handleDisasterClick(item.disasterId, item.disasterTitle)}
      >
        <Text style={styles.title}>{item.disasterTitle || "Unknown Disaster"}</Text>
        <Text style={styles.text}>
          {`Total Reports: ${item.events.length}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Navigate to payment event details page for a specific disaster
  const handleDisasterClick = (disasterId: string, disasterTitle: string) => {
    navigation.navigate('PaymentEventDetailPage', { disasterId, disasterTitle }); // Pass both disasterId and disasterTitle
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Events</Text>
      {groupedDisasters.length === 0 ? (
        <Text style={styles.noDataText}>No payment events available.</Text>
      ) : (
        <FlatList
          data={groupedDisasters}
          renderItem={renderDisaster}
          keyExtractor={(item) => item.disasterId}
        />
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E5F1FF',  // Light blue background for a clean modern feel
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 25,
    textAlign: 'center',
    color: '#1E3A8A',  // Dark blue for header text to maintain contrast
  },
  disasterContainer: {
    marginBottom: 18,
  },
  disasterItem: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#B8D0E6',  // Soft light blue border
    shadowColor: '#3B82F6',  // Blue shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A8A',  // Dark blue for titles
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#4B5563',  // Slightly muted grayish blue for readability
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    color: '#3B82F6',  // Blue color for loading state
  },
  errorText: {
    fontSize: 18,
    color: '#B91C1C',  // Red for errors to stand out
    textAlign: 'center',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',  // Muted gray for no data state
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PaymentEventsPage;
