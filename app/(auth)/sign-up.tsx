import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import { Picker } from "@react-native-picker/picker";
var { width, height } = Dimensions.get("screen");
const Signup = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    gender: "",
    // dob: new Date(),
    dob: "",
    mobile: "",
    password: "",
    // confirmPassword:"",
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [emergencyInfo, setEmergencyInfo] = useState({
    emergencyContactName: "",
    emergencyContact: "",
    emergencyRelationWithContact: "",
  });

  const handleNext = () => {
    if (page < 3) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handlePrev = () => {
    if (page >= 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSignup = () => {
    // Handle signup logic here (e.g., API call)
    console.log("Signing up with:", { ...personalInfo, ...additionalInfo });
    router.push("/(auth)/sign-in"); // Navigate to Sign In page
  };
  const handleDateChange = () => {};
  // GPS Coordinates (if relevant for real-time location tracking)
  // Role or Purpose of Registration
  // User Type (e.g., Volunteer, Relief Worker, Victim/Survivor, Coordinator)
  // Skills or Expertise (e.g., First Aid, Search and Rescue, Logistics)
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {page === 1 && (
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
            <TextInput
              style={styles.input}
              placeholder="Date of Birth ex: 27-12-2006"
              placeholderTextColor={"gray"}
              value={personalInfo.dob}
              onChangeText={(text) =>
                setPersonalInfo({ ...personalInfo, dob: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor={"gray"}
              value={personalInfo.mobile}
              onChangeText={(text) =>
                setPersonalInfo({ ...personalInfo, mobile: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"gray"}
              value={personalInfo.password}
              onChangeText={(text) =>
                setPersonalInfo({ ...personalInfo, password: text })
              }
            />
            <ButtonComponent
              handleNext={handleNext}
              handlePrev={handlePrev}
              page={page}
            />
          </View>
        )}

        {page === 2 && (
          <>
            <Text style={styles.text}>Additional Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor={"gray"}
              value={additionalInfo.address}
              onChangeText={(text) =>
                setAdditionalInfo({ ...additionalInfo, address: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor={"gray"}
              value={additionalInfo.city}
              onChangeText={(text) =>
                setAdditionalInfo({ ...additionalInfo, city: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor={"gray"}
              value={additionalInfo.state}
              onChangeText={(text) =>
                setAdditionalInfo({ ...additionalInfo, state: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor={"gray"}
              value={additionalInfo.country}
              onChangeText={(text) =>
                setAdditionalInfo({ ...additionalInfo, country: text })
              }
            />
            {/* <Button title="Next" onPress={handleNext} /> */}
            <ButtonComponent
              handleNext={handleNext}
              handlePrev={handlePrev}
              page={page}
            />
          </>
        )}

        {page === 3 && (
          <>
            <Text style={styles.text}>Emergency Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Name"
              placeholderTextColor={"gray"}
              value={emergencyInfo.emergencyContactName}
              onChangeText={(text) =>
                setEmergencyInfo({
                  ...emergencyInfo,
                  emergencyContactName: text,
                })
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
            <Button title="Sign Up" onPress={handleSignup} />
            <ButtonComponent
              handleNext={handleNext}
              handlePrev={handlePrev}
              page={page}
            />
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Signup;

const ButtonComponent = ({ handlePrev, handleNext, page }: any) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={handlePrev}
        style={styles.button}
        disabled={page === 1}
      >
        <ArrowLeftIcon size={24} color={page === 1 ? "gray" : "white"} />
        {/* <Text style={styles.buttonText}>Prev</Text> */}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNext}
        style={styles.button}
        disabled={page === 3}
      >
        <ArrowRightIcon size={24} color={page === 3 ? "gray" : "white"} />
        {/* <Text style={styles.buttonText}>Next</Text> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#282c34",
    // backgroundColor: "#f0f4f8",
  },
  pageStyle: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    height: height,
  },
  picker: {
    height: 50,
    width: "100%",
    // borderWidth: 12,
    // borderColor: "white",
    color: "gray",
  },
  bottom: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  text: {
    // color: "white",
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
  infoText: {
    color: "white",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",

    // backgroundColor: "#007BFF", // Change to your preferred color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
  },
});
