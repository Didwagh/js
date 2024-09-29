import React, { useState } from 'react';
import { View, Button, Text, Alert, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // Ensure you install this package
import { uploadVideo, createDisasterReport } from '@/lib/appwrite'; // Adjust the import path

const VideoUploader: React.FC = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [reporterId] = useState<string>('66f81c18003ac075c184'); // Static reporter ID for now

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });

      // Check if the result is successful
      if (result.assets && result.assets.length > 0) {
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
      <TextInput
        placeholder="Enter disaster title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
      />
      <Button title="Pick a Video" onPress={pickVideo} />
      {videoUri && <Text>Selected Video: {videoUri}</Text>}
      <Button title={uploading ? 'Uploading...' : 'Upload Video'} onPress={handleUpload} disabled={uploading} />
      {uploadUrl && <Text>Uploaded Video URL: {uploadUrl}</Text>}
    </View>
  );
};

export default VideoUploader;
