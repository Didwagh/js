import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';

const PostRequirementForm = () => {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Submit data to Appwrite or backend
    console.log({ type, quantity, description });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Type of Kit (Food / Medicine / Clothes):</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="e.g., Food"
      />

      <Text style={styles.label}>Quantity Required:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="e.g., 100"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Any extra info"
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button title="Post Requirement" onPress={handleSubmit} color="#1e90ff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default PostRequirementForm;
