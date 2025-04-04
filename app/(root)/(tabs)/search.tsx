import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const search = () => {
    
  const handleSearchFocus = () => {
    router.navigate("/(root)/searchBar");
  };
  
  const handlePress = () => {
    router.navigate("/(root)/searchBar");
  };
  return (
    <View>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handlePress}>
          {/* <Text style={styles.searchButtonText}>Search</Text> */}
          <Ionicons name="search-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          placeholderTextColor="#888"
          onFocus={handleSearchFocus}
        />
      </View>
    </View>
  );
}

export default search

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  searchButton: {
    // backgroundColor: '#4CAF50',
    // paddingVertical: 10,
    // paddingHorizontal: 1,
    borderRadius: 8,
    // marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});