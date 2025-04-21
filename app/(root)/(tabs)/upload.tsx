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
  const [report, setReport] = useState("");

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });

      if (result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setVideoUri(uri);
        setReport(JSON.stringify(result));
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
      <View style={styles.formBox}>
        <Text style={styles.heading}>Report Disaster</Text>
  
        <TextInput
          placeholder="Enter disaster title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
  
        <TextInput
          placeholder="Enter disaster description"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
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
  
        <TouchableOpacity onPress={pickVideo} style={styles.btn}>
          <Text style={styles.btnText}>Pick a Video</Text>
        </TouchableOpacity>
  
        {videoUri && (
          <View style={styles.videoContainer}>
            <Text style={styles.subHeading}>Selected Video:</Text>
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
          style={[
            styles.btn,
            uploading && { backgroundColor: "#A0C4FF" }
          ]}
          disabled={uploading}
        >
          <Text style={styles.btnText}>
            {uploading ? "Uploading..." : "Upload Video"}
          </Text>
        </TouchableOpacity>
  
        {uploadUrl && (
          <Text style={styles.uploadedUrl}>Uploaded Video URL: {uploadUrl}</Text>
        )}
  
        {report && (
        // report.map((item)=>{
          <Text style={styles.reportText}>{report}</Text>
        // })
        )}
      </View>
    </View>
  );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAF6FF",
      justifyContent: "center",  // centers the form vertically
      alignItems: "center",      // centers the form horizontally
      paddingHorizontal: 20,
    },
    formBox: {
      width: "100%",
      maxWidth: 500,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    heading: {
      fontSize: 24,
      fontWeight: "700",
      color: "#0077B6",
      textAlign: "center",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#00B4D8",
      borderRadius: 8,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 12,
      fontSize: 16,
      color: "#333",
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#00B4D8",
      borderRadius: 8,
      backgroundColor: "#FFFFFF",
      marginBottom: 14,
      overflow: "hidden",
    },
    btn: {
      backgroundColor: "#00B4D8",
      borderRadius: 10,
      padding: 14,
      alignItems: "center",
      marginVertical: 8,
    },
    btnText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    videoContainer: {
      marginVertical: 14,
    },
    subHeading: {
      fontSize: 16,
      color: "#0077B6",
      marginBottom: 8,
    },
    video: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      backgroundColor: "#000",
    },
    uploadedUrl: {
      marginTop: 12,
      color: "green",
      fontSize: 14,
    },
    reportText: {
      marginTop: 10,
      color: "#333",
      fontSize: 14,
    },
  });

export default VideoUploader;
