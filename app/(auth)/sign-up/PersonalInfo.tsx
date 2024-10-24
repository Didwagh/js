import { View, Text, Dimensions, StyleSheet,Button  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// import DatePicker from 'react-native-date-picker';


var { width, height } = Dimensions.get("screen");
const PersonalInfoPage = ({personalInfo,setPersonalInfo,role,setRole,setLastpage}:any) => { 
  // const [dob, setDob] = useState(new Date()); // Local state for date of birth

  // useEffect(() => {
  //   if (personalInfo.dob) {
  //     setDob(new Date(personalInfo.dob)); // Convert to Date object if dob is not empty
  //   }
  // }, [personalInfo.dob]);
  return (
    <View>
      <View style={styles.pageStyle}>
        <Text style={styles.text}>Personal Information</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#ccc"
            value={personalInfo.name}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, name: text })
            }
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#ccc"
            value={personalInfo.email}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personalInfo.gender}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setPersonalInfo({ ...personalInfo, gender: itemValue })
            }
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (DD-MM-YYYY)"
            placeholderTextColor="#ccc"
            value={personalInfo.dob}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, dob: text })
            }
          />
        </View>

        {/* <DatePicker mode='date' date={dob} onDateChange={(value:Date)=>setDob(value)}/> */}
          {/* <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          placeholderTextColor={"gray"}
          value={personalInfo.dob ? dob.toLocaleDateString() : ''} // Show formatted date
          editable={false} // Make it read-only
        />
        <DatePicker
          mode='date'
          date={dob} // Use the local state for the date
          onDateChange={(value: Date) => {
            setDob(value); // Update local state
            setPersonalInfo({ ...personalInfo, dob: value.toISOString() }); // Update personalInfo with ISO string
          }}
        /> */}
           <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#ccc"
            value={personalInfo.mobile}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, mobile: text })
            }
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personalInfo.role}
            style={styles.picker}
            onValueChange={(role) => {
              setPersonalInfo({ ...personalInfo, role: role });
              setRole(role);
            }}
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Volunteer" value="Volunteer" />
            <Picker.Item label="Relief Worker" value="Relief Worker" />
            <Picker.Item label="NGO" value="NGO" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={personalInfo.password}
            secureTextEntry={true}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, password: text })
            }
          />
        </View>
      </View>
    </View>
  );
}

export default PersonalInfoPage;

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
    paddingHorizontal: 3,
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
});
