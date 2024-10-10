import React, { useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";
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
      <Button title="Choose Image" onPress={chooseImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

export default IdentityProof;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
