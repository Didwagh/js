import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

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

    const avatarUrl = `https://avatars.dicebear.com/api/human/${username}.svg`; // Example avatar URL
  

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
        city : "" ,
        district : "" 
      }
    );
    console.log(newUser + "new user created using create user ")

    return newUser;
  } catch (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log(session + "session is in progress ")
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
    console.log("fetching user if he is logged in ")
    console.log(currentUser)
    return currentUser.documents[0];
  } catch (error) {
    console.log("no user is logged in")
    console.log(error);
    return null;
  }
}

export async function signOut() {
  try {
    console.log("siging out ")
    const session = await account.deleteSession("current");
console.log(session)
    return session;
    
  } catch (error) {
    throw new Error(error);
  }
}


export async function updateUserLocation(location) {
  try {
    const user = await getCurrentUser(); // Ensure this is awaited
    if (!user) {
      throw new Error("No user found");
    }
    
    const userId = user.accountId; 
    const userDocumentId = user.$id; // Use the user's document ID here
    
    console.log("userId:", userId, "userDocumentId:", userDocumentId);
    
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
