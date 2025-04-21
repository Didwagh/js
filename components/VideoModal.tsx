import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  videoUrl?: string;
}

const bucketId = '66f65d3f000136515646';
const projectId = '66f659470031288fb7d6';

const VideoModal: React.FC<VideoModalProps> = ({ visible, onClose, videoUrl }) => {
  const convertUrl = (url: string) => {
    const parts = url.split('/');
    const fileId = parts[6];
    return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&fileId=${fileId}`;
  };

  const updatedUrl = videoUrl ? convertUrl(videoUrl) : '';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Hey there, here is the video!</Text>
          {updatedUrl ? (
            <Video
              source={{ uri: updatedUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
            />
          ) : (
            <Text style={styles.noVideoText}>No video available.</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
    modalContent: {
      width: '90%', // Adjusted to be more responsive
      padding: 20,
      backgroundColor: '#E0F2F1', // Light blue background for modal content
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000', // Light shadow effect for depth
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6, // Slight elevation for depth
    },
    modalHeading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#00796B', // Dark teal text for heading (for contrast)
      marginBottom: 15,
    },
    video: {
      width: '100%',
      height: 200,
      marginVertical: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#B2DFDB', // Lighter border around the video for softer appearance
    },
    noVideoText: {
      fontSize: 16,
      color: '#00796B', // Matching dark teal color for the "No video available" message
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: '#80CBC4', // Lighter blue for the close button
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 16,
      color: '#FFFFFF', // White text on the close button
      fontWeight: 'bold',
    },
  });

export default VideoModal;
