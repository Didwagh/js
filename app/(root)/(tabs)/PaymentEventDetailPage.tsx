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
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading Payment Events...</Text>
      </View>
    );
  }
  
  // If there's an error, display an error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Something went wrong: {error}</Text>
      </View>
    );
  }

  // Render each payment event related to the selected disaster
  const renderPaymentEvent = ({ item }: { item: PaymentEvent }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>Amount: ₹{item.Amount.toFixed(2)}</Text>
      <Text style={styles.eventText}>User ID: {item.userId}</Text>
      <Text style={styles.eventText}>Date: {new Date(item.$createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{disasterTitle}</Text>
  
      {/* Display the total amount for this disaster */}
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Total Amount: ₹ {totalAmount.toFixed(2)}</Text>
      </View>
  
      {paymentEvents.length === 0 ? (
        <Text style={styles.noDataText}>No payment events available for this disaster.</Text>
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
    backgroundColor: '#EFF6FF', // Light blue background for a clean look
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A', // Dark blue text for the header
    marginBottom: 18,
    marginTop: 25,
    textAlign: 'center',
  },
  totalAmountContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB', // Light gray border
    shadowColor: '#3B82F6', // Blue shadow for a touch of style
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalAmountText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3B82F6', // Bright blue for total amount
  },
  eventContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#3B82F6', // Light blue shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A', // Dark blue for event title
    marginBottom: 6,
  },
  eventText: {
    fontSize: 14,
    color: '#4B5563', // Dark gray for event details
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#3B82F6',
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    color: '#B91C1C', // Red for errors
    textAlign: 'center',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280', // Soft gray for no data state
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PaymentEventDetailPage;
