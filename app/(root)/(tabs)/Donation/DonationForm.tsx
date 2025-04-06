import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const DonationForm = () => {
  const route = useRoute();
  const { requirement }: any = route?.params;
  const [donationQty, setDonationQty] = useState("");

  const handleDonate = () => {
    // Update the requirement with new donation (via backend)
    // console.log(`Donated ${donationQty} kits for ${requirement.type}`);
    console.log(requirement);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>🎁 Donate to: {requirement.type}</Text>
      <Text style={styles.description}>📝 {requirement.description}</Text>
      <Text style={styles.detail}>📦 Required: {requirement.required}</Text>
      <Text style={styles.detail}>✅ Received: {requirement.received}</Text>
      <Text style={styles.detail}>🔴 Remaining: {requirement.required - requirement.received}</Text> */}

      <TextInput
        style={styles.input}
        placeholder="Enter number of kits"
        value={donationQty}
        onChangeText={setDonationQty}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Submit Donation"
          onPress={handleDonate}
          color="#1e90ff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  input: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default DonationForm;
