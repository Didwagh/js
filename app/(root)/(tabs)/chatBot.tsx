import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatbot } from '@/lib/appwrite';
import { Picker } from '@react-native-picker/picker';

// Define types for the state
type Language = 'en' | 'hi' | 'mr' | 'ml' | 'kn';

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

    return (
        <View style={styles.container}>
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

            <TextInput
                style={styles.input}
                placeholder="Enter your message"
                value={inputText}
                onChangeText={setInputText}
            />
            <Button title="Send" onPress={callChatbotApi} color="#6200EE" />
            {loading && <ActivityIndicator size="large" color="#6200EE" />}
            {response && !loading && <Text style={styles.response}>{response}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f4f7', // Light background color
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    picker: {
        height: 40,
        width: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    languagePickerContainer: {
        position: 'absolute',
        top: -5, // Add space at the top to avoid overlap
        right: 16,
        zIndex: 1,
        padding: 8,
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
