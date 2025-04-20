import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getAllPaymentEvents } from '@/lib/appwrite'; // Assuming this function is implemented

interface PaymentEvent {
  $id: string;
  userId: string;
  disasterId: string;
  Amount: number;
  $createdAt: string; // Date string from Appwrite
}

const PaymentEventDetailPage: React.FC = () => {
  const route = useRoute();
  const { disasterId, disasterTitle } = route.params as { disasterId: string; disasterTitle: string };

  const [paymentEvents, setPaymentEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentEventsForDisaster = async () => {
      try {
        const events = await getAllPaymentEvents(); // Fetch all payment events
        const filteredEvents = events.filter((event) => event.disasterId === disasterId); // Filter by disasterId
        setPaymentEvents(filteredEvents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment events');
        setLoading(false);
      }
    };

    fetchPaymentEventsForDisaster();
  }, [disasterId]); // Re-fetch if disasterId changes

  // Calculate the total amount for this disaster
  const totalAmount = paymentEvents.reduce((total, event) => total + event.Amount, 0);

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

  // Render each payment event related to the selected disaster
  const renderPaymentEvent = ({ item }: { item: PaymentEvent }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>Amount: ₹{item.Amount}</Text>
      <Text style={styles.eventText}>User ID: {item.userId}</Text>
      <Text style={styles.eventText}>Date: {new Date(item.$createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{disasterTitle}</Text>

      {/* Display the total amount for this disaster */}
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Total Amount: ₹ {totalAmount.toFixed(2)} </Text>
      </View>

      {paymentEvents.length === 0 ? (
        <Text>No payment events for this disaster.</Text>
      ) : (
        <FlatList
          data={paymentEvents}
          renderItem={renderPaymentEvent}
          keyExtractor={(item) => item.$id}
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
  totalAmountContainer: {
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  eventContainer: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventText: {
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

export default PaymentEventDetailPage;
