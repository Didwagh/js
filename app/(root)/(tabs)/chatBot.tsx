import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, ScrollView, KeyboardAvoidingView,  Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatbot } from '@/lib/appwrite';
import { Picker } from '@react-native-picker/picker';

// Define types for the state
type Language = 'en' | 'hi' | 'mr' | 'ml' | 'kn';

const disasterImages = {
  Fire: 'https://media.istockphoto.com/id/113494458/photo/fire-isolated-over-black-background.jpg?s=612x612&w=0&k=20&c=u6STGsSpJAyBN8kDeqnVUla4-0SnLpdaTsehFsey2p0=',
  Flood: 'https://media.istockphoto.com/id/1327617934/photo/aerial-view-of-flooded-houses-with-dirty-water-of-dnister-river-in-halych-town-western-ukraine.jpg?s=612x612&w=0&k=20&c=ffFK1c1lx15S3PlX-tee1py2wkLiKYLad67VvFwTG2I=',
  Earthquake: 'https://cdn.britannica.com/41/166941-131-E27FD3A6/Yingxiu-school-China-Sichuan-earthquake-May-2008.jpg',
  Tsunami: 'https://media.istockphoto.com/id/1392793617/photo/powerful-large-ocean-wave.jpg?s=612x612&w=0&k=20&c=tiSBi7mKMSpRPEMZ94SVhEtZCSeO8D9kUTgVuxUxsUo=',
};

const ChatBot: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en'); // Default language is English

  useEffect(() => {
    // Load the saved language preference from AsyncStorage
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          setLanguage(savedLanguage as Language); // Type assertion to ensure it matches the Language type
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const saveLanguage = async (selectedLanguage: Language) => {
    try {
      await AsyncStorage.setItem('language', selectedLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const callChatbotApi = async () => {
    if (inputText.trim() === '') {
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const chatbotResponse = await chatbot(inputText, language); // Pass the selected language to the API
      setResponse(chatbotResponse);
    } catch (error) {
      console.error('Error chatting up:', error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addDisasterToInput = (disaster: string) => {
    setInputText(disaster); // Update the input text with the disaster name
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
  
        {/* Language Selection Dropdown */}
        <View style={styles.languagePickerContainer}>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue: Language) => {
              setLanguage(itemValue);
              saveLanguage(itemValue);
            }}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Hindi" value="hi" />
            <Picker.Item label="Marathi" value="mr" />
            <Picker.Item label="Malayalam" value="ml" />
            <Picker.Item label="Kannada" value="kn" />
          </Picker>
        </View>
  
        {/* Disaster blocks */}
        {/* 
        <View style={styles.disasterContainer}>
          {Object.keys(disasterImages).map((disaster, index) => (
            <TouchableOpacity
              key={index}
              style={styles.disasterBlock}
              onPress={() => addDisasterToInput(disaster)}
            >
              <ImageBackground
                source={{ uri: disasterImages[disaster] }}
                style={styles.disasterImageBackground}
              >
                <Text style={styles.disasterText}>{disaster}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        */}
  
        {/* Scrollable Chat Area */}
      <ScrollView style={styles.chatContainer}>
        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#13A0EC" />
          </View>
        )}

        {/* Display Bot Response */}
        {!loading && response && (
          <View style={styles.botMessage}>
            <Text style={styles.botText}>{response}</Text>
          </View>
        )}
      </ScrollView>

      {/* Fixed Input Bar for User Messages */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#8FA3BF"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={callChatbotApi}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light neutral background
  },

  // Main container for all components
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Language dropdown container aligned to top-right
  languagePickerContainer: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },

  // Language picker dropdown styles
  picker: {
    height: 44,
    width: 150,
    backgroundColor: '#E0ECFF', // Light blue
    borderRadius: 8,
  },

  // Scrollable container for chat messages
  chatContainer: {
    flex: 1,
    padding: 8,
    marginBottom: 70, // Space for input field at bottom
  },

  // Centered loader for when response is fetching
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },

  // Bot message bubble
  botMessage: {
    backgroundColor: '#E5F2FF', // Light blue chat bubble
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    shadowColor: '#13A0EC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Bot message text styling
  botText: {
    color: '#03045E',  // Dark blue text
    fontSize: 16,
    lineHeight: 22,
  },

  // Fixed bottom input + send button container
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#D0D7E2',
    alignItems: 'center',
  },

  // User text input field
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B5C9EA', // Subtle blue-gray border
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#03045E',
  },

  // Send button container
  sendButton: {
    backgroundColor: '#13A0EC', // Bright blue button
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#13A0EC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Send button text styling
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatBot;