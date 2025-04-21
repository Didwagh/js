import React,{ useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import SimpleMap from "@/components/Map";
import usePushNotification from "@/hooks/usePushNotification";
import { getDisastersByLocation } from "@/lib/appwrite";

const HomeScreen: React.FC = () => {
  const expoPushToken = usePushNotification();
  console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  // console.log(expoPushToken);
  
  // const disasterUpdates = [
  //   { id: "1", title: "Flood in Jakarta", status: "Urgent Assistance Needed" },
  //   { id: "2", title: "Wildfire in California", status: "Evacuations Ongoing" },
  //   { id: "3", title: "Earthquake in Japan", status: "Rescue Teams Deployed" },
  //   {
  //     id: "4",
  //     title: "Landslide in Nepal",
  //     status: "Blocked roads, need rescue",
  //   },
  //   {
  //     id: "5",
  //     title: "Storm in Philippines",
  //     status: "Power outage in many areas",
  //   },
  // ];
  // const router = useRouter();

  interface Disaster {
    $id: string;
    title: string;
    disasterType?: string;
    city?: string;
    district?: string;
    date?: string;
  }
  
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const disasterReports = await getDisastersByLocation();

        // Map the disasterReports to match the Disaster interface
        const mappedDisasters: Disaster[] = disasterReports.map((report) => ({
          $id: report.$id,
          title: report.title || "Unknown Title", // Provide a default value if title is missing
          disasterType: report.disasterType,
          city: report.city,
          district: report.district,
          date: report.date,
        }));

        // Sort by date if a date field exists (assuming `date` is the field for sorting)
        const sortedDisasters = mappedDisasters.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });

        // Take only the most recent 10 reports
        setDisasters(sortedDisasters.slice(0, 10));
      } catch (error) {
        console.error("Error fetching disaster reports:", error);
        Alert.alert("Error", "Unable to fetch disaster reports. Please try again later.");
      }
    };

    fetchDisasters();
  }, []); // Only fetch data on mount

  const handleNavigate = () => {};
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
  
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Disaster Relief & Response</Text>
        <Text style={styles.heroSubtitle}>
          Be the help they need — Join, Report, and Support!
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.navigate("/(root)/(tabs)/upload")}
          >
            <Ionicons name="megaphone" size={20} color="#fff" />
            <Text style={styles.buttonText}>Report Disaster</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.navigate("/(root)/(tabs)/helpUs")}
          >
            <Ionicons name="hand-left" size={20} color="#fff" />
            <Text style={styles.buttonText}>Volunteer Now</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Live Disaster Updates</Text>
        <FlatList
          data={disasters}
          keyExtractor={(item) => item.$id}  // Use the unique id for each disaster
          style={styles.flatList}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.disasterCard}>
              <Text style={styles.disasterTitle}>{item.title}</Text>
              <Text style={styles.disasterStatus}>
                {item.disasterType || "No type available"}
              </Text>
              <Text style={styles.disasterStatus}>
                {item.city}, {item.district}
              </Text>
            </View>
          )}
        />
        {/* <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="people" size={30} color="#0077B6" />
            <Text style={styles.helpCardText}>Volunteer Opportunities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="call" size={30} color="#00B4D8" />
            <Text style={styles.helpCardText}>Emergency Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="heart" size={30} color="#023E8A" />
            <Text style={styles.helpCardText}>Donate & Support</Text>
          </TouchableOpacity>
        </View> */}
  
        <SimpleMap />
      </View>
    </SafeAreaView>
  );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAF6FF", // Light blue background
    },
    heroSection: {
      padding: 20,
      backgroundColor: "#90E0EF",
      alignItems: "center",
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 5,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#023E8A",
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 16,
      color: "#03045E",
      marginTop: 8,
      textAlign: "center",
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    buttonPrimary: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#0077B6",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
    },
    buttonSecondary: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#00B4D8",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
    },
    buttonText: {
      color: "white",
      marginLeft: 8,
      fontWeight: "600",
      fontSize: 15,
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#03045E",
      marginVertical: 12,
    },
    flatList: {
      maxHeight: Dimensions.get("window").height * 0.50,
    },
    disasterCard: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      marginBottom: 12,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    disasterTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#0077B6",
    },
    disasterStatus: {
      fontSize: 14,
      color: "#D00000",
      marginTop: 1,
    },
  
    // helpSection: {
    //   flexDirection: "row",
    //   justifyContent: "space-between",
    //   marginTop: 20,
    // },
    // helpCard: {
    //   alignItems: "center",
    //   justifyContent: "center",
    //   padding: 15,
    //   backgroundColor: "#FFFFFF",
    //   borderRadius: 12,
    //   flex: 1,
    //   marginHorizontal: 5,
    //   elevation: 3,
    //   shadowColor: "#000",
    //   shadowOpacity: 0.05,
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowRadius: 3,
    // },
    // helpCardText: {
    //   textAlign: "center",
    //   marginTop: 8,
    //   fontSize: 14,
    //   color: "#023E8A",
    // },
  });

export default HomeScreen;
