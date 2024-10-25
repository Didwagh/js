import React, { useState } from 'react';
import { View, Button, TouchableOpacity, Text, Alert, TextInput, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import { uploadVideo, createDisasterReport } from '@/lib/appwrite'; 
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';

const VideoUploader: React.FC = () => {
  const { user } = useGlobalContext();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [disasterType, setDisasterType] = useState<string>(''); // State for disaster type

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
    if (!disasterType) {
      Alert.alert('Please select a disaster type');
      return;
    }
  
    setUploading(true);
    try {
      const url = await uploadVideo(videoUri);
      setUploadUrl(url);
  
      const locationData = await AsyncStorage.getItem('locationData');
      const parsedLocationData = locationData ? JSON.parse(locationData) : null;
  
      await createDisasterReport({
        title,
        video: url,
        city: parsedLocationData?.city || '',
        district: parsedLocationData?.district || '',
        approvedBy: '', 
        disasterType, // Use the selected disaster type
      });
  
      Alert.alert('Upload successful', 'Video uploaded and disaster report created successfully.');
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report and Share Critical Disaster Information</Text>

      {/* <Text style={styles.label}>Select Disaster Type</Text> */}
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={disasterType}
        onValueChange={(itemValue) => setDisasterType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Disaster Type" value="" />
        <Picker.Item label="Natural" value="natural" />
        <Picker.Item label="Man-Made" value="man-made" />
      </Picker>
      </View>

      <TextInput
        placeholder="Enter Disaster Description"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity 
        onPress={pickVideo} 
        style={styles.button}
        activeOpacity={0.7} // Reduces opacity when pressed for feedback
      >
       <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>
      
      {videoUri ? (
        <View style={styles.videoContainer}>
          <Text style={styles.label}>Selected Video:</Text>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        </View>
        ) : (
          <Text style={styles.noVideoText}>No video selected. Please pick a video.</Text>
      )}

      <TouchableOpacity
        onPress={handleUpload}
        style={[styles.button, uploading && styles.buttonDisabled]} // Disable styling when uploading
        disabled={uploading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Video'}</Text>
      </TouchableOpacity>
      
      {uploadUrl && (
        <Text style={styles.uploadedUrl}>
        Uploaded Video URL: <Text style={styles.urlLink}>{uploadUrl}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',  
    fontWeight: 'bold', 
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 15,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',  
    borderRadius: 5,
    marginTop: 15,  
    backgroundColor: '#fff',  
  },
  picker: {
    height: 50,
    width: '100%',
  },
  videoContainer: {
    marginVertical: 15,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  uploadedUrl: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007bff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#aaa', 
  },
  noVideoText: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  urlLink: {
    textDecorationLine: 'underline',
  },
});

export default VideoUploader;
