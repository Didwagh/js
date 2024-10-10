import { View, Dimensions, StyleSheet, Text, Button } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get("screen");
const EmergencyInfo = ({emergencyInfo,setEmergencyInfo,page,lastpage,handleSignup}:any) => {
  return (
    <View style={styles.pageStyle}>
      <Text style={styles.text}>Emergency Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Name"
        placeholderTextColor={"gray"}
        value={emergencyInfo.emergencyContactName}
        onChangeText={(text) =>
          setEmergencyInfo({ ...emergencyInfo, emergencyContactName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact"
        placeholderTextColor={"gray"}
        value={emergencyInfo.emergencyContact}
        onChangeText={(text) =>
          setEmergencyInfo({ ...emergencyInfo, emergencyContact: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Relation With Contact"
        placeholderTextColor={"gray"}
        value={emergencyInfo.emergencyRelationWithContact}
        onChangeText={(text) =>
          setEmergencyInfo({
            ...emergencyInfo,
            emergencyRelationWithContact: text,
          })
        }
      />
      {page === lastpage && (
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} />
        </View>
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
  buttonContainer: {
    marginTop: 20, // Add some space above the button
    width: "100%", // Ensure the button takes full width
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: "gray",
  },
  input: {
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "white",
    width: "100%",
  },
});
