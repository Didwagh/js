import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import IdentityProof from '@/components/IdentityProof'; 
const { width, height } = Dimensions.get("screen");

// 11.	Skills or Expertise (e.g., First Aid, Search and Rescue, Logistics) 
// 12.	Availability (full-time/part-time, hours of availability) 
// 13.	Identity Verification (if necessary) Government ID (optional, for higher-level access) 
// 14.	Medical and Safety Information Allergies or Medical Conditions (important for victims or relief workers) 
// 15.	Consent and Policies Consent to Terms and Conditions Consent to Privacy Policy Opt-in for Email or SMS Updates (optional but useful for communication


const MoreInfo = ({moreInfo,setMoreInfo,page,lastpage,handleSignup,}:any) => {
  return (
    <View style={styles.pageStyle}>
      <Text style={styles.text}>More Information</Text>
      {/* <TextInput
        style={styles.input}
        placeholder="Skill"
        placeholderTextColor={"gray"}
        value={moreInfo.password}
        onChangeText={(text) => setMoreInfo({ ...moreInfo, password: text })}
      /> */}

      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={moreInfo.skill}
          onValueChange={(skill) => {
            setMoreInfo({ ...moreInfo, skill: skill });
          }}
        >
          <Picker.Item label="Select Skill" value="" />
          <Picker.Item label="First Aid" value="First Aid" />
          <Picker.Item label="Search and Rescue" value="Search and Rescue" />
          <Picker.Item label="Logistics" value="Logistics" />
        </Picker>    
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={moreInfo.availability}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setMoreInfo({ ...moreInfo, availability: itemValue })
          }
        >
          <Picker.Item label="Select Availability" value="" />
          <Picker.Item label="Full Time" value="Full Time" />
          <Picker.Item label="Part Time" value="Part Time" />
          <Picker.Item label="Hours" value="Hours" />
        </Picker>
      </View>
      <IdentityProof/>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"gray"}
        value={moreInfo.password}
        onChangeText={(text) => setMoreInfo({ ...moreInfo, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"gray"}
        value={moreInfo.password}
        onChangeText={(text) => setMoreInfo({ ...moreInfo, password: text })}
      />
      {page === lastpage && (
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} />
        </View>
      )}
    </View>
  );
}

export default MoreInfo


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
  
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    color: "gray",
    overflow: "hidden",
    width: "100%",
    marginBottom: 10,
    // backgroundColor:"#000"
  },

  picker: {
    color: "gray",
    height: 50,
    width: "100%",
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
