import React, { useState } from 'react';
import { View, Button, Text, Alert, TextInput, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import { uploadVideo, createDisasterReport } from '@/lib/appwrite'; 
import { Video, ResizeMode } from 'expo-av'; 

const VideoUploader: React.FC = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [reporterId] = useState<string>('66f81c18003ac075c184'); // Static reporter ID for now

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });

      
      if (result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0]; 
        setVideoUri(uri);
      } else {
        Alert.alert('No video selected');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error picking video');
    }
  };

  const handleUpload = async () => {
    if (!videoUri) {
      Alert.alert('Please select a video first');
      return;
    }
    if (!title) {
      Alert.alert('Please enter a title for the disaster report');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadVideo(videoUri);
      setUploadUrl(url);
      
      // Create disaster report with the uploaded video URL
      await createDisasterReport({
        title,
        video: url,
        reporter: reporterId,
      });

      Alert.alert('Upload successful', `Video uploaded successfully.`);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter disaster title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button title="Pick a Video" onPress={pickVideo} />
      {videoUri && (
        <View style={styles.videoContainer}>
          <Text>Selected Video:</Text>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN} // Use the ResizeMode enum
            isLooping
          />
        </View>
      )}
      <Button title={uploading ? 'Uploading...' : 'Upload Video'} onPress={handleUpload} disabled={uploading} />
      {uploadUrl && <Text style={styles.uploadedUrl}>Uploaded Video URL: {uploadUrl}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  videoContainer: {
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  uploadedUrl: {
    marginTop: 10,
    color: 'green',
  },
});

export default VideoUploader;
