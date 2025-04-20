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
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  // Render each disaster (group of payment events)
  const renderDisaster = ({ item }: { item: DisasterGroupedEvents }) => (
    <View style={styles.disasterContainer}>
      <TouchableOpacity
        style={styles.disasterItem}
        onPress={() => handleDisasterClick(item.disasterId, item.disasterTitle)} // Pass both disasterId and disasterTitle
      >
        <Text style={styles.title}>
          {item.disasterTitle || "Unknown Disaster"} {/* Ensure disasterTitle is a valid string */}
        </Text>
        <Text style={styles.text}>
          {`Total Reports: ${item.events.length}`} {/* Ensure the value is properly formatted */}
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
        <Text>No payment events available.</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  disasterContainer: {
    marginBottom: 15,
  },
  disasterItem: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default PaymentEventsPage;
