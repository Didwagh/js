import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { chatbot } from '@/lib/appwrite'

const chatBot = () => {
    const [inputText, setInputText] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const callChatbotApi = async () => {

        if (inputText.trim() === '') {
            return; 
        }

        setLoading(true);
        setResponse(''); 

        try {
        
            const chatbotResponse = await chatbot(inputText);
            setResponse(chatbotResponse); 
        } catch (error) {
            console.error("Error chatting up:", error);
            setResponse("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your message"
                value={inputText}
                onChangeText={setInputText}
            />
            <Button title="Send" onPress={callChatbotApi} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
        borderRadius: 4,
    },
    response: {
        marginTop: 20,
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
});

export default chatBot;
