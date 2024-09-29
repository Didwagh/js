import {
  Account,
  Client,
  Databases,
  ID,
  Storage,
} from "react-native-appwrite";
import * as FileSystem from 'expo-file-system';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.js",
  projectId: "66f659470031288fb7d6",
  databaseId: "66f65b1b003421eeb2d1",
  userCollectionId: "66f65b65003c84699459",
  disasterCollectionId: "66f65b9d002eb0a0d117",
  storageId: "66f65d3f000136515646" // Replace with your storage bucket ID
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client); // Initialize Storage client

// Function to upload video and return its URL
export const uploadVideo = async (videoUri: string): Promise<string> => {
  try {
    // Get video file information
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    
    // Check if the file exists
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Ensure name is defined
    const fileName = fileInfo.uri.split('/').pop() || 'video.mp4'; // Fallback name

    // Create a file object with the required structure
    const videoFile = {
      name: fileName, // Ensure this is a string
      type: 'video/mp4', // Change this according to your video type
      size: fileInfo.size || 0, // Default to 0 if size is not available
      uri: videoUri
    };

    // Upload the video to Appwrite storage
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(), // Generate a unique ID for the file
      videoFile, // Set appropriate permissions
    );

    // Return the file URL
    const fileUrl = `${appwriteConfig.endpoint}/storage/files/${response.$id}/view`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

