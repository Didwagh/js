import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';
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
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={"gray"}
          value={personalInfo.name}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"gray"}
          value={personalInfo.email}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, email: text })
          }
        />

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
        <TextInput
          style={styles.input}
          placeholder="Date of Birth ex: 27-12-2006"
          placeholderTextColor={"gray"}
          value={personalInfo.dob}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, dob: text })
          }
        />
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
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor={"gray"}
          value={personalInfo.mobile}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, mobile: text })
          }
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personalInfo.role}
            style={styles.picker}
            onValueChange={(role) => {
              setPersonalInfo({ ...personalInfo, role: role });
              setRole(role);
            }}
          >
            {/* Volunteer, Relief Worker, users, admin, NGOs */}
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Volunteer" value="Volunteer" />
            <Picker.Item label="Relief Worker" value="Relief Worker" />
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="NGO" value="NGO" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={personalInfo.password}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, password: text })
          }
        />
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
    // color: 'rgba(200,250,250,0.6)',
    width: "100%",
  },
});
