import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VideoModal from '@/components/VideoModal';
import { useGlobalContext } from '@/context/GlobalProvider';
import {
  createVolunteerEvent,
  deleteDisasterById,
  deleteVolunteerReportsByDisasterId,
  createPaymentIntent,
  createPaymentEvent
} from '@/lib/appwrite';
import {
  initPaymentSheet,
  presentPaymentSheet
} from '@stripe/stripe-react-native';

const DetailsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const { id, title, description, city, district, disasterType, video } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [service, setService] = useState('');
  const [hasVolunteered, setHasVolunteered] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationInput, setShowDonationInput] = useState(false); // 👈 NEW

  const handlePayment = async () => {
    const amount = parseInt(donationAmount, 10);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }

    try {
      const { clientSecret } = await createPaymentIntent(amount);

      const init = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'DisasterRelief Org',
      });

      if (init.error) {
        Alert.alert('Error', init.error.message);
        return;
      }

      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        Alert.alert('Payment failed', paymentResult.error.message);
      } else {
        console.log(donationAmount)
        console.log(donationAmount)
        console.log(donationAmount)
        console.log(donationAmount)
        Alert.alert('Thank you!', 'Your donation was successful. ❤️' );
        await createPaymentEvent(user.$id,id,parseInt(donationAmount))
        setDonationAmount('');
        setShowDonationInput(false); 
      }
    } catch (err) {
      console.error('Payment process error:', err , donationAmount);
      Alert.alert('Error', 'Unable to process the payment at the moment.');
    }
  };

  const handleOpenVideo = () => setModalVisible(true);
  const handleCloseVideo = () => setModalVisible(false);
  const handleOpenVolunteerModal = () => setVolunteerModalVisible(true);
  const handleCloseVolunteerModal = () => setVolunteerModalVisible(false);

  const handleVolunteerSubmit = async () => {
    try {
      await createVolunteerEvent(service, user.$id, id, title);
      setService('');
      setVolunteerModalVisible(false);
      setHasVolunteered(true);
      Alert.alert(
        'Thank you!',
        'Thank you for volunteering. Admin will contact you for further information.'
      );
    } catch (err) {
      console.error('Failed to submit volunteer event:', err);
      Alert.alert('Error', 'Something went wrong while submitting your request.');
    }
  };

  const handleDeleteDisaster = () => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this disaster and all its reports?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVolunteerReportsByDisasterId(id);
              await deleteDisasterById(id);

              Alert.alert('Deleted', 'Disaster and its reports have been deleted.');
              router.replace({
                pathname: '/helpUs',
                params: { refresh: Date.now().toString() },
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete disaster or reports.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Description: {description}</Text>
      <Text style={styles.info}>Location: {city}, {district}</Text>
      <Text style={styles.info}>Type: {disasterType}</Text>
  
      {/* Volunteer Button */}
      {user.role !== 'User' && !hasVolunteered && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleOpenVolunteerModal}
          >
            <Text style={styles.buttonText}>Volunteer</Text>
          </TouchableOpacity>
        </View>
      )}
  
      {/* Donation Section */}
      <View style={styles.buttonContainer}>
        {!showDonationInput ? (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: "#00B4D8" }]} 
            onPress={() => setShowDonationInput(true)}
          >
            <Text style={styles.buttonText}>Donate</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.donationInputContainer}>
          <Text style={styles.label}>Enter Donation Amount (₹):</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 100"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={setDonationAmount}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
            <Text style={styles.submitButtonText}>Confirm Donation</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDonationInput(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    
  
      {/* Video Button */}
      {video && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: "#00B4D8" }]} 
          onPress={handleOpenVideo}
        >
          <Text style={styles.buttonText}>Watch Video</Text>
        </TouchableOpacity>
      )}
  
      {/* Delete Button (Admins only) */}
      {user.role === 'Admin' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: "#dc3545" }]} 
            onPress={handleDeleteDisaster}
          >
            <Text style={styles.buttonText}>Delete Disaster</Text>
          </TouchableOpacity>
        </View>
      )}
  
      {/* Volunteer Modal */}
      <Modal
        visible={volunteerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseVolunteerModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Service / Role</Text>
            <TextInput
              style={styles.input}
              value={service}
              onChangeText={setService}
              placeholder="Enter your service or role"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleVolunteerSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseVolunteerModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  
      <VideoModal
        visible={modalVisible}
        onClose={handleCloseVideo}
        videoUrl={video}
      />
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f1faff', // Light blue background color
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#007bff', // Light blue for title
    },
    info: {
      fontSize: 18,
      marginVertical: 5,
      color: '#555',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: '500',
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#007bff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      marginVertical: 10,
      width: '100%',
    },
    button: {
      backgroundColor: '#007bff', // Light blue for buttons
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5, // Shadow effect for floating effect
      shadowColor: '#007bff',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    donationInputContainer: {
      marginVertical: 10,
    },
    submitButton: {
      backgroundColor: '#00B4D8', // Light blue for buttons
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5, // Shadow effect for floating effect
      shadowColor: '#007bff',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    cancelText: {
      marginTop: 10,
      color: 'red',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: '#007bff',
    },
  });

export default DetailsPage;
