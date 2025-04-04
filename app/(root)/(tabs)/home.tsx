import React from "react";
import {View,Text,TouchableOpacity,FlatList,ScrollView,StyleSheet,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";

const HomeScreen: React.FC = () => {
  // Simulated disaster updates
  const disasterUpdates = [
    { id: "1", title: "Flood in Jakarta", status: "Urgent Assistance Needed" },
    { id: "2", title: "Wildfire in California", status: "Evacuations Ongoing" },
    { id: "3", title: "Earthquake in Japan", status: "Rescue Teams Deployed" },
  ];
  const router=useRouter()
  const handleNavigate=()=>{}
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <Navbar/>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Disaster Relief & Response</Text>
        <Text style={styles.heroSubtitle}>
          Be the help they need - Join, Report, and Support!
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={()=>router.navigate('/(root)/(tabs)/upload')}>
            <Ionicons name="megaphone" size={20} color="white" />
            <Text style={styles.buttonText}>Report Disaster</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary}>
            <Ionicons name="hand-left" size={20} color="white" />
            <Text style={styles.buttonText}>Volunteer Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Live Disaster Updates */}
        <Text style={styles.sectionTitle}>Live Disaster Updates</Text>
        <FlatList
          data={disasterUpdates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.disasterCard}>
              <Text style={styles.disasterTitle}>{item.title}</Text>
              <Text style={styles.disasterStatus}>{item.status}</Text>
            </View>
          )}
        />

        {/* How You Can Help */}
        <Text style={styles.sectionTitle}>How You Can Help</Text>
        <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="people" size={30} color="#4CAF50" />
            <Text style={styles.helpCardText}>Volunteer Opportunities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="call" size={30} color="#2196F3" />
            <Text>Emergency Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard}>
            <Ionicons name="heart" size={30} color="#FF5722" />
            <Text>Donate & Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  heroSection: {padding: 20,backgroundColor: "#dfdfdf",alignItems: "center"},
  heroTitle: { fontSize: 24, fontWeight: "bold", color: "black" },
  heroSubtitle: {fontSize: 16,color: "black",marginVertical: 10,textAlign: "center"},
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  buttonPrimary: {flexDirection: "row",alignItems: "center",backgroundColor: "#4CAF50",padding: 10,borderRadius: 5,},
  buttonSecondary: {flexDirection: "row",alignItems: "center",backgroundColor: "#2196F3",padding: 10,borderRadius: 5,},
  buttonText: { color: "white", marginLeft: 5 },
  content: { padding: 20,gap:5 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 7 },
  disasterCard: {padding: 15,backgroundColor: "white",borderRadius: 8,marginBottom: 10,elevation: 2,},
  disasterTitle: { fontSize: 16, fontWeight: "bold" },
  disasterStatus: { fontSize: 14, color: "red", marginTop: 5 },
  helpSection: {flexDirection: "row",justifyContent: "space-between",marginTop: 10,},
  helpCard: {alignItems: "center",padding: 15,backgroundColor: "white",borderRadius: 8,flex: 1,marginHorizontal: 5,elevation: 2,},
  helpCardText:{flex:1,textAlign:'center',padding:1}
});

export default HomeScreen;
