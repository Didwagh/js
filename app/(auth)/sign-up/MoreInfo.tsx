import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import IdentityProof from '@/components/IdentityProof'; 
const { width, height } = Dimensions.get("screen");
import { Ionicons } from '@expo/vector-icons';

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
        <Ionicons name="school-outline" size={20} color="gray" style={styles.icon} />
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
        <Ionicons name="calendar-outline" size={20} color="gray" style={styles.icon} />
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

      {/* <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={moreInfo.password}
          onChangeText={(text) => setMoreInfo({ ...moreInfo, password: text })}
          secureTextEntry
        />
      </View> */}

      {page === lastpage && (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity >
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff", 
    paddingHorizontal: 10,
  },

  picker: {
    flex: 1,
    color: "#ccc",
    height: 50,
    width: "100%",
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
    marginTop: 40,
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
