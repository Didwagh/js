import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import ButtonComponent from "@/components/ButtonComponet";
import PersonalInfo from "./PersonalInfo";
import AdditionalInfo from "./AdditionalInfo";
import EmergencyInfo from "./EmergencyInfo";
import MoreInfo from "./MoreInfo";

var { width, height } = Dimensions.get("screen");
const Signup = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [lastpage, setLastpage] = useState(4);
  const [role, setRole] = useState("");
  const [showSignupBtn, setShowSignupBtn] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    mobile: "",
    password: "",
    role: "",
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

  const [moreInfo, setMoreInfo] = useState({
    skill: "", //First Aid, Search and Rescue, Logistics
    availability: "", //full-time/part-time, hours of availability
  });

  // useEffect(() => {
  //   if (role == "User" || role == "Volunteer" || role == "NGO" || role == "Relief Worker") {
  //     setLastpage(4);
  //   } else {
  //     setLastpage(3);
  //   }
  // }, [role]);

  const handleSignup = () => {
    // Handle signup logic here (e.g., API call)
    console.log("Signing up with:", { ...personalInfo, ...AdditionalInfo });
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
          <View>
            <PersonalInfo
              personalInfo={personalInfo}
              setPersonalInfo={setPersonalInfo}
              role={role}
              setRole={setRole}
              setLastpage={setLastpage}
            />
            <ButtonComponent
              page={page}
              lastPage={lastpage}
              setPage={setPage}
            />
          </View>
        )}

        {page === 2 && (
          <View>
            <AdditionalInfo
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
            />
            <ButtonComponent
              page={page}
              lastPage={lastpage}
              setPage={setPage}
            />
          </View>
        )}

        {page === 3 && (
          <View>
            <EmergencyInfo
              emergencyInfo={emergencyInfo}
              setEmergencyInfo={setEmergencyInfo}
              page={page}
              lastpage={lastpage}
              handleSignup={handleSignup}
            />
            <ButtonComponent
              page={page}
              lastPage={lastpage}
              setPage={setPage}
            />
          </View>
        )}

        {page === 4 && (
          <View>
            <MoreInfo
              moreInfo={moreInfo}
              setMoreInfo={setMoreInfo}
              page={page}
              lastpage={lastpage}
              handleSignup={handleSignup}
            />
            <ButtonComponent
              page={page}
              setPage={setPage}
              lastPage={lastpage}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f9fc", 
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    height: height,
  },
});
