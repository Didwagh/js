import { View, Dimensions, TouchableOpacity, StyleSheet, Text, Button } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("screen");
const EmergencyInfo = ({emergencyInfo,setEmergencyInfo,page,lastpage,handleSignup}:any) => {
  return (
    <View style={styles.pageStyle}>
      <Text style={styles.text}>Emergency Information</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={24} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact"
          placeholderTextColor={"#ccc"}
          value={emergencyInfo.emergencyContact}
          onChangeText={(text) =>
            setEmergencyInfo({ ...emergencyInfo, emergencyContact: text })
          }
          accessibilityLabel="Emergency Contact Number"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Name"
          placeholderTextColor={"#ccc"}
          value={emergencyInfo.emergencyContactName}
          onChangeText={(text) =>
            setEmergencyInfo({ ...emergencyInfo, emergencyContactName: text })
          }
          accessibilityLabel="Emergency Contact Name"
        />
      </View>

            <View style={styles.inputContainer}>
        <Ionicons name="people-outline" size={24} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="Relation With Contact"
          placeholderTextColor={"#ccc"}
          value={emergencyInfo.emergencyRelationWithContact}
          onChangeText={(text) =>
            setEmergencyInfo({
              ...emergencyInfo,
              emergencyRelationWithContact: text,
            })
          }
          accessibilityLabel="Relation With Contact"
        />
      </View>

      {page === lastpage && (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity >
      )}

    </View>
  );
}

export default EmergencyInfo;

const styles = StyleSheet.create({
  pageStyle: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    height: height,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    width: '50%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
