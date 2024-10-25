import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VideoModal from '@/components/VideoModal'; // Adjust the import path as needed

const DetailsPage: React.FC = () => {
  const { id, title, description, city, district, disasterType, video } = useLocalSearchParams();
  console.log(disasterType)
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenVideo = () => {
    setModalVisible(true);
  };

  const handleCloseVideo = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Description: {description}</Text>
      <Text style={styles.info}>Location: {city}, {district}</Text>
      <Text style={styles.info}>Type: {disasterType}</Text>
      {video && (
        <Button title="Watch Video" onPress={handleOpenVideo} />
      )}
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
});

export default DetailsPage;
