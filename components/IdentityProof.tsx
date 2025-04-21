import React, { useState } from "react";
import { View, Button, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const IdentityProof = () => {
  const [imageUri, setImageUri] = useState(null);
  const options:any = {
    mediaType: "photo",
    quality: 1,
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "This app needs access to your camera to take photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const chooseImage = async () => {
    try {
      const response:any = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    } catch (error) {
      console.error("Error launching image library: ", error);
    }
  };
  //  const uploadImage = async () => {
  //    const { uri } = image;
  //    const filename = uri.substring(uri.lastIndexOf("/") + 1);
  //    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
  //    setUploading(true);
  //    setTransferred(0);
  //    const task = storage().ref(filename).putFile(uploadUri);
  //    // set progress state
  //    task.on("state_changed", (snapshot) => {
  //      setTransferred(
  //        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
  //      );
  //    });
  //    try {
  //      await task;
  //    } catch (e) {
  //      console.error(e);
  //    }
  //    setUploading(false);
  //    Alert.alert(
  //      "Photo uploaded!",
  //      "Your photo has been uploaded to Firebase Cloud Storage!"
  //    );
  //    setImage(null);
  //  };

  const takePhoto = async () => {  
    const hasPermission = await requestCameraPermission();
    // console.log(hasPermission)
    if (!hasPermission) return;
    try {
      const response:any = await launchCamera(options);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    } catch (error) {
      console.error("Error launching camera: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Upload Identity Proof</Text>
      
      <TouchableOpacity style={styles.buttonContainer} onPress={chooseImage}>
        <Ionicons name="image-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.buttonContainer} onPress={takePhoto}>
        <Ionicons name="camera-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}
export default IdentityProof;
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#E8F0FF", // Soft light blue background for modern appeal
      flex: 1,
    },
    text: {
      fontSize: 24,
      marginBottom: 20,
      color: "#1E3A8A", // Dark blue for the text, making it stand out
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 15,
      backgroundColor: '#3B82F6',  // Blue button background
      borderRadius: 8,
      padding: 12,
      width: 180,  // Increased width for better tap area
      height: 50, 
      elevation: 3, // Slight elevation to give it a floating effect
    },
    buttonText: {
      fontSize: 14,
      marginLeft: 10,
      color: '#fff',
      fontWeight: 'bold',
    },
    image: {
      width: 250,
      height: 250,
      marginTop: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#A5B3CC", // Light blue border for the image
    },
    icon: {
      marginRight: 10,
    },
  });