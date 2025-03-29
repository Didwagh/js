import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadVideo, createDisasterReport } from "@/lib/appwrite";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";

const VideoUploader: React.FC = () => {
  const { user } = useGlobalContext();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // New state for description
  const [disasterType, setDisasterType] = useState<string>(""); // State for disaster type

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });

      if (result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setVideoUri(uri);
      } else {
        Alert.alert("No video selected");
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error picking video");
    }
  };

  const handleUpload = async () => {
    if (!videoUri) {
      Alert.alert("Please select a video first");
      return;
    }
    if (!title) {
      Alert.alert("Please enter a title for the disaster report");
      return;
    }
    if (!disasterType) {
      Alert.alert("Please select a disaster type");
      return;
    }
    if (!description) {
      Alert.alert("Please enter a description for the disaster report");
      return; // Check for description
    }

    setUploading(true);
    try {
      const url = await uploadVideo(videoUri);
      setUploadUrl(url);

      const locationData = await AsyncStorage.getItem("locationData");
      const parsedLocationData = locationData ? JSON.parse(locationData) : null;

      await createDisasterReport({
        title,
        video: url,
        city: parsedLocationData?.city || "",
        district: parsedLocationData?.district || "",
        approvedBy: "",
        disasterType, // Use the selected disaster type
        description, // Include the description
      });

      Alert.alert(
        "Upload successful",
        "Video uploaded and disaster report created successfully."
      );
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload failed", "An unknown error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report Disaster</Text>
      <TextInput
        placeholder="Enter disaster title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter disaster description" // New input for description
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={disasterType}
          onValueChange={(itemValue) => setDisasterType(itemValue)}
        >
          <Picker.Item label="Select disaster type" value="" />
          <Picker.Item label="Natural" value="natural" />
          <Picker.Item label="Man-Made" value="man-made" />
        </Picker>
      </View>
      {/* <Button title="Pick a Video" onPress={pickVideo} /> */}
      <TouchableOpacity onPress={pickVideo} style={styles.btn}>
        <Text style={styles.btnText}>Pick a Video</Text>
      </TouchableOpacity>
      {videoUri && (
        <View style={styles.videoContainer}>
          <Text>Selected Video:</Text>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        </View>
      )}
      {/* <Button
        title={uploading ? "Uploading..." : "Upload Video"}
        onPress={handleUpload}
        disabled={uploading}
      /> */}
      <TouchableOpacity
        onPress={handleUpload}
        style={[styles.btn, { backgroundColor: "#1E90FF" }]}
        disabled={uploading}
      >
        <Text style={styles.btnText}>
          {uploading ? "Uploading..." : "Upload Video"}
        </Text>
      </TouchableOpacity>
      {uploadUrl && (
        <Text style={styles.uploadedUrl}>Uploaded Video URL: {uploadUrl}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    height: 50,
    marginBottom: 10,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  heading: {
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  videoContainer: {
    marginVertical: 10,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  uploadedUrl: {
    marginTop: 10,
    color: "green",
  },
  btn: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    fontSize: 12,
    backgroundColor: "#3774e5",
    marginVertical: 7,
  },
  btnText: {
    fontWeight: "bold",
    color: "white",
    // borderRadius: 5,
  },
});

export default VideoUploader;
