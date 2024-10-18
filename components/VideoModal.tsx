import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  videoUrl?: string; // Make sure to define the videoUrl prop here
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
  console.log(updatedUrl)

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Hey there, here is the video!</Text>
          <Text>{updatedUrl}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default VideoModal;
