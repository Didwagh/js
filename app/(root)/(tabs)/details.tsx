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
import { useLocalSearchParams } from 'expo-router';
import VideoModal from '@/components/VideoModal';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createVolunteerEvent } from '@/lib/appwrite';

const DetailsPage: React.FC = () => {
  const { user } = useGlobalContext();
  const { id, title, description, city, district, disasterType, video } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [service, setService] = useState('');

  const handleOpenVideo = () => setModalVisible(true);
  const handleCloseVideo = () => setModalVisible(false);
  const handleOpenVolunteerModal = () => setVolunteerModalVisible(true);
  const handleCloseVolunteerModal = () => setVolunteerModalVisible(false);

  const [hasVolunteered, setHasVolunteered] = useState(false);
  // at top with other imports

  const handleVolunteerSubmit = async () => {
    try {
      await createVolunteerEvent(service, user.$id, id, title);
      console.log('Volunteer event submitted');
      setService('');
      setVolunteerModalVisible(false);
      setHasVolunteered(true); // Hide the button
      Alert.alert('Thank you!', 'Thank you for volunteering. Admin will contact you for further information.');
    } catch (err) {
      console.error('Failed to submit volunteer event:', err);
      Alert.alert('Error', 'Something went wrong while submitting your request.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Description: {description}</Text>
      <Text style={styles.info}>Location: {city}, {district}</Text>
      <Text style={styles.info}>Type: {disasterType}</Text>

      {user.role !== 'User' && !hasVolunteered && (
        <View style={{ marginVertical: 10 }}>
          <Button title="Volunteer" onPress={handleOpenVolunteerModal} />
        </View>
      )}


      {video && (
        <Button title="Watch Video" onPress={handleOpenVideo} />
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
              <Text style={{ marginTop: 10, color: 'red' }}>Cancel</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailsPage;
