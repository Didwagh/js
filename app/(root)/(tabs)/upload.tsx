import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // Ensure you install this package
import { uploadVideo } from '@/lib/appwrite'; // Adjust the import path

const VideoUploader: React.FC = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    

      // Check if the result is successful
      if ( result.assets && result.assets.length > 0) {
        const { uri, mimeType } = result.assets[0]; // Accessing the first asset
        setVideoUri(uri);
        console.log('MIME Type:', mimeType); // Log the MIME type
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

    setUploading(true);
    try {
      const url = await uploadVideo(videoUri);
      setUploadUrl(url);
      Alert.alert('Upload successful', `Video URL: ${url}`);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick a Video" onPress={pickVideo} />
      {videoUri && <Text>Selected Video: {videoUri}</Text>}
      <Button title={uploading ? 'Uploading...' : 'Upload Video'} onPress={handleUpload} disabled={uploading} />
      {uploadUrl && <Text>Uploaded Video URL: {uploadUrl}</Text>}
    </View>
  );
};

export default VideoUploader;
