import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.js",
  projectId: "66f659470031288fb7d6",
  databaseId: "66f65b1b003421eeb2d1",
  userCollectionId: "66f65b65003c84699459",
  disasterCollectionId: "66f65b9d002eb0a0d117",
  storageId: "66f65d3f000136515646"
};

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Create User
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error('Failed to create account');

    const avatarUrl = `https://avatars.dicebear.com/api/human/${username}.svg`;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        city: "",
        district: ""
      }
    );
    console.log("New user created using createUser");
    return newUser;
  } catch (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session is in progress");
    return session;
  } catch (error) {
    throw new Error(`Sign-in failed: ${error.message}`);
  }
}

// Get Account (optional)
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(`Fetching account failed: ${error.message}`);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    console.log("Fetching user if he is logged in");
    return currentUser.documents[0];
  } catch (error) {
    console.log("No user is logged in");
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    console.log("Signing out");
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Update User Location
export async function updateUserLocation(location) {
  try {
    const user = await getCurrentUser(); // Ensure this is awaited
    if (!user) {
      throw new Error("No user found");
    }

    const userDocumentId = user.$id; // Use the user's document ID here

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userDocumentId,
      {
        city: location.city,
        district: location.district,
      }
    );

    console.log("User location updated successfully.");
  } catch (error) {
    console.error("Failed to update user location:", error);
  }
}

// Upload Video
export const uploadVideo = async (videoUri) => {
  try {
    console.log("Uploading video");
    const fileInfo = await FileSystem.getInfoAsync(videoUri);

    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileName = fileInfo.uri.split('/').pop() || 'video.mp4';

    const videoFile = {
      name: fileName,
      type: 'video/mp4',
      size: fileInfo.size || 0,
      uri: videoUri
    };

    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      videoFile
    );

    const fileUrl = `${appwriteConfig.endpoint}/storage/files/${response.$id}/view`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

// Create Disaster Report
export const createDisasterReport = async (data) => {
  try {
    console.log("Creating disaster report", data);
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disasterCollectionId,
      ID.unique(),
      data,
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error creating disaster report:', error);
    throw new Error('Failed to create disaster report');
  }
};


//getting disaster by location and unapproved 
export const getUnapprovedDisasterReports = async (city) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.disasterCollectionId,
      [Query.equal('approvedBy', '')]
    );

    // Filter the reports by city if provided
    const filteredReports = city
      ? response.documents.filter(report => report.city === city)
      : response.documents;

    console.log("Unapproved disaster reports fetched successfully:", filteredReports);
    return filteredReports;
  } catch (error) {
    console.error('Error fetching unapproved disaster reports:', error);
    throw new Error('Failed to fetch unapproved disaster reports');
  }
};
