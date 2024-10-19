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
export async function createUser(email, password, username, expoPushToken, userType, idProofUri) {
  let imgUrl = ""; // Initialize imgUrl as an empty string
  console.log(expoPushToken, "from back end");
  
  if (!expoPushToken) {
    throw new Error('Expo Push Token is required.');
  }

  try {
    // Await the uploadImage function to get the URL
    imgUrl = await uploadImage(idProofUri); // Ensure to await the function
    console.log("Image uploaded:", imgUrl);
  } catch (error) {
    console.log("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }

  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error('Failed to create account');
    console.log(userType, idProofUri);

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
        district: "",
        role: userType,
        idproof: imgUrl || "Error: No URL returned from image upload",
        token: expoPushToken, // Optional: store push token
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

//upload image
export const uploadImage = async (imageUri) => {
  try {
    console.log("Uploading image");
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileName = fileInfo.uri.split('/').pop() || 'image.png'; // Default to PNG if no name

    const imageFile = {
      name: fileName,
      type: 'image/jpeg', // Adjust based on your actual image type
      size: fileInfo.size || 0,
      uri: imageUri
    };

    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      imageFile
    );

    const fileUrl = `${appwriteConfig.endpoint}/storage/files/${response.$id}/view`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
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

// Getting disaster by location and unapproved 
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

    // console.log("Unapproved disaster reports fetched successfully:", filteredReports);
    return filteredReports;
  } catch (error) {
    console.error('Error fetching unapproved disaster reports:', error);
    throw new Error('Failed to fetch unapproved disaster reports');
  }
};

// Update Disaster Report Approval
export const updateDisasterReportApproval = async (reportId, approvedBy) => {
  try {
    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disasterCollectionId,
      reportId, 
      { approvedBy }
    );
    console.log("doc report from back end after approval " , updatedDoc.city)
    console.log("doc report from back end after approval " , updatedDoc.disasterType)
    getUsersWithTokens(updatedDoc.city,updatedDoc.district)
  } catch (error) {
    console.error('Error updating report:', error);
    throw new Error('Failed to update report status');
  }
};

// Get Users with Non-Empty Tokens
export const getUsersWithTokens = async (city, district) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.notEqual('token', ''),
        Query.equal('city', city),    // Filter by city
        Query.equal('district', district) // Filter by district
      ]
    );

    // Extract tokens from filtered user documents
    const tokens = response.documents.map(user => ({ token: user.token }));

    console.log("Tokens fetched successfully:", tokens);

    for (const { token } of tokens) {
      await sendPushNotification(token); // Assuming hellllowworld is an async function
    }

    return tokens;
  } catch (error) {
    console.error('Error fetching users with tokens:', error);
    throw new Error('Failed to fetch users with tokens');
  }
};


export const sendPushNotification = async (token) => {
  console.log("sending notification through backend");

  const message = {
    to: token, // Make sure token is a string, not an object
    sound: 'default',
    title: 'RUN!',
    body: 'Run away you bastard you might get affected',
    data: { someData: 'goes here' },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Get Users with Specific Role and Verification Status
export const getUnverifiedNonUserRoles = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.notEqual('role', 'User'), // Exclude users with role "User"
        Query.equal('verified', false)   // Include only users with verified set to false
      ]
    );

    console.log("Unverified non-user role accounts fetched successfully:", response.documents);
    return response.documents; // Return the array of matching user documents
  } catch (error) {
    console.error('Error fetching unverified non-user role accounts:', error);
    throw new Error('Failed to fetch unverified non-user role accounts');
  }
};

// Update User Verification Status
export const updateUserVerificationStatus = async (userId, verified) => {
  try {
    const userDocumentId = userId; // Use the user's document ID
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userDocumentId,
      { verified } // Set verified to true or null
    );
    console.log("User verification status updated successfully.");
  } catch (error) {
    console.error("Error updating user verification status:", error);
    throw new Error('Failed to update user verification status');
  }
};


const getLocationData = async () => {
  try {
    const locationData = await AsyncStorage.getItem('locationData'); // Adjust the key as needed
    if (locationData) {
      return JSON.parse(locationData);
    }
    throw new Error("No location data found");
  } catch (error) {
    console.error("Error retrieving location data:", error);
    return null;
  }
};

// Function to fetch disaster reports based on user's location
export const getDisastersByLocation = async () => {
  try {
    const locationData = await getLocationData();
    if (!locationData) throw new Error("Location data is required");

    const { city, district } = locationData;

    // Fetch disasters from Appwrite, filtering by city and district
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.disasterCollectionId,
      [
        Query.equal('city', city),
        Query.equal('district', district)
      ]
    );

    // console.log("Disaster reports fetched successfully:", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Error fetching disaster reports:", error);
    throw new Error("Failed to fetch disaster reports");
  }
};