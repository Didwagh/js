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
    const city = "hellow" ;
    const state = "maharastra" ;

    await signIn(email, password); // Ensure signIn function is correctly defined

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        city : city ,
        state : state ,

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