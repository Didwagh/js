import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { getUnverifiedNonUserRoles, updateUserVerificationStatus } from '@/lib/appwrite'; // Adjust the import path

// Define a User type to represent user data
interface User {
  $id: string;
  username: string;
  email: string;
  phoneNumber: string; // Add phone number field
  idProofUrl: string;  // Add ID proof image URL field
}

const bucketId = '66f65d3f000136515646';
const projectId = '66f659470031288fb7d6';

const convertUrl = (url: string) => {
  const parts = url.split('/');
  const fileId = parts[6];
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&fileId=${fileId}`;
};

const UserApprovalPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Use User type for state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const unverifiedDocuments = await getUnverifiedNonUserRoles();
        const unverifiedUsers: User[] = unverifiedDocuments.map(doc => ({
          $id: doc.$id,
          username: doc.username, // Ensure this matches your data
          email: doc.email,       // Ensure this matches your data
          phoneNumber: doc.phoneNumber, // Map phone number
          idProofUrl: doc.idproof ? convertUrl(doc.idproof) : '', // Convert ID proof URL
        }));
        setUsers(unverifiedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleApproval = async (userId: string) => {
    try {
      await updateUserVerificationStatus(userId, true);
      Alert.alert("Success", "User approved successfully!");
      setUsers((prev) => prev.filter(user => user.$id !== userId)); // Remove approved user from list
    } catch (error) {
      console.error("Error approving user:", error);
      Alert.alert("Error", "Failed to approve user.");
    }
  };

  const handleRejection = async (userId: string) => {
    try {
      await updateUserVerificationStatus(userId, null);
      Alert.alert("Success", "User rejected successfully!");
      setUsers((prev) => prev.filter(user => user.$id !== userId)); // Remove rejected user from list
    } catch (error) {
      console.error("Error rejecting user:", error);
      Alert.alert("Error", "Failed to reject user.");
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>{item.username} - {item.email}</Text>
      <Text style={styles.userText}>Phone: {item.phoneNumber}</Text>
      {item.idProofUrl ? (
        <Image
          source={{ uri: item.idProofUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.userText}>No ID Proof Available</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Approve" onPress={() => handleApproval(item.$id)} />
        <Button title="Reject" onPress={() => handleRejection(item.$id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Approval Page</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        // showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 30,
    textAlign: 'center',
  },
  userItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  userText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  list: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    marginVertical: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});

export default UserApprovalPage;
