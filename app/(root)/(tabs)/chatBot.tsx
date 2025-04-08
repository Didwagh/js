import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.languagePickerContainer}>
        <Picker
          selectedValue={language}
          style={styles.picker}
          onValueChange={(itemValue: Language) => {
            setLanguage(itemValue);
            saveLanguage(itemValue); // Save the selected language
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

      {/* Text Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.sendButton} onPress={callChatbotApi}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6200EE" />}
      {response && !loading && <Text style={styles.response}>{response}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6', // Light background color
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  languagePickerContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  disasterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  disasterBlock: {
    width: 120,
    height: 120,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  disasterImageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  disasterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text readability
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  sendButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default ChatBot;
