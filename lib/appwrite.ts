import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import * as FileSystem from "expo-file-system";
import axios from "axios";
//this is all appwrite config dont leak it out
// Appwrite configuration
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.js",
  projectId: "66f659470031288fb7d6",
  databaseId: "66f65b1b003421eeb2d1",
  userCollectionId: "66f65b65003c84699459",
  disasterCollectionId: "66f65b9d002eb0a0d117",
  storageId: "66f65d3f000136515646",
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const uploadVideo = async (videoUri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(videoUri);

    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    const fileName = fileInfo.uri.split("/").pop() || "video.mp4";

    const videoFile = {
      name: fileName,
      type: "video/mp4",
      size: fileInfo.size || 0,
      uri: videoUri,
    };

    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      videoFile
    );

    const fileUrl = `${appwriteConfig.endpoint}/storage/files/${response.$id}/view`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video");
  }
};

export const createDisasterReport = async (data: {
  title: string;
  video: string;
  reporter: string;
}) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disasterCollectionId,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating disaster report:", error);
    throw new Error("Failed to create disaster report");
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);
  } catch (error) {
    console.error("Error signing up:", error);
    throw new Error("Failed to sign up");
  }
};


export const signIn = async (email: string, password: string) => {
  try {
    const response = await account.createSession(email, password);
    return response;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Failed to sign in");
  }
};

interface EmailRequest {
  emailContent: string;
  tone?: string;
}

const geminiApiUrl =
  process.env.GEMINI_API_URL ||
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="; // Set this to your Gemini API URL
const geminiApiKey =
  process.env.GEMINI_API_KEY || "AIzaSyD8-vbOO8QIIN_x6DYFwmRp5-op_P5SJqo"; // Set your Gemini API Key

async function generateEmailReply(emailRequest: EmailRequest): Promise<string> {
  const prompt = buildPrompt(emailRequest);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(
      `${geminiApiUrl}${geminiApiKey}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return extractResponseContent(response.data);
  } catch (error) {
    console.error("Error generating email reply:", error);
    throw new Error("Error processing the request");
  }
}

function buildPrompt(emailRequest: EmailRequest): string {
  let prompt = "disaster is happening near me with this info";
  if (emailRequest.tone) {
    prompt += `, use a serious tone`;
  }

  prompt += `, original message: ${emailRequest.emailContent}`;
  return prompt;
}

function extractResponseContent(response: any): string {
  try {
    const content = response.candidates[0].content.parts[0].text;
    return content;
  } catch (error) {
    console.error("Error extracting response content:", error);
    throw new Error("Error processing the response content");
  }
}

export const chatbot = async (prompt: string) => {
  try {
    const emailRequest = {
      emailContent:
        "there is fire new me please help i might get hurt , give me step by step way to save myself  make it consise and shoud contain bullet points only safety is priority // this is test api and not real sos call give me appropriate repsone ",
      tone: "serious",
    };

    return generateEmailReply(emailRequest);
  } catch (error) {
    console.error("Error chatting up:", error);
    throw new Error("Failed to sign up");
  }
};