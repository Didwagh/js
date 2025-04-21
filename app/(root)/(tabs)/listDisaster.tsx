import React, { useEffect, useState } from "react";
import {View,Text,FlatList,StyleSheet,ActivityIndicator,Alert,Button,TouchableOpacity,} from "react-native";
import { Client, Databases, Models } from "react-native-appwrite";
import {getUnapprovedDisasterReports,updateDisasterReportApproval} from "@/lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { appwriteConfig } from "@/lib/appwrite";
import VideoModal from "@/components/VideoModal"; // Import the modal

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

interface DisasterReport extends Models.Document {
  title: string;
  video: string;
  city: string;
  district: string;
  approvedBy: string;
}

const DisasterReports = () => {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(
    null
  );
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        // const locationDataString = await AsyncStorage.getItem("locationData");
        const locationDataString  = user.city
        // if (locationDataString) {
        //   const locationData = JSON.parse(locationDataString);
          // setUserCity(locationData.city);
          setUserCity(locationDataString);

        // }
    
        

   

     
      } catch (error) {
        console.error("Failed to fetch user city:", error);
      }
    };

    fetchUserCity();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userCity) return;

      try {
        const data: Models.Document[] = await getUnapprovedDisasterReports(
          userCity
        );
        const mappedReports: DisasterReport[] = data.map((doc) => ({
          ...doc,
          title: doc.title || "",
          video: doc.video || "",
          city: doc.city || "",
          district: doc.district || "",
          approvedBy: doc.approvedBy || "",
        }));
        setReports(mappedReports);

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load disaster reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userCity]);

  const updateReportApproval = async (reportId: string, approvedBy: string) => {
    try {
      await updateDisasterReportApproval(reportId, approvedBy);
      setReports((prevReports) =>
        prevReports.filter((report) => report.$id !== reportId)
      );
      Alert.alert(
        "Success",
        approvedBy === "rejected"
          ? "Report rejected successfully."
          : "Report approved successfully."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update report status");
    }
  };

  const handleApprove = (reportId: string) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to approve reports.");
      return;
    }
    updateReportApproval(reportId, user.$id);
  };

  const handleReject = (reportId: string) => {
    updateReportApproval(reportId, "rejected");
  };

  const handleVideoButtonPress = (report: DisasterReport) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const renderReport = ({ item }: { item: DisasterReport }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>City: {item.city}</Text>
      <Text>District: {item.district}</Text>
      <Text>Approved By: {item.approvedBy || "Not approved"}</Text>
      <View style={styles.buttonContainer}>
        {/* <Button title="Approve" onPress={() => handleApprove(item.$id)} /> */}
        {/* <Button title="Reject" onPress={() => handleReject(item.$id)} />
        <Button title="Video" onPress={() => handleVideoButtonPress(item)} /> */}
        <TouchableOpacity
          style={[styles.btn, styles.approveBtn]}
          onPress={() => handleApprove(item.$id)}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.rejectBtn]}
          onPress={() => handleReject(item.$id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.videoBtn]}
          onPress={() => handleVideoButtonPress(item)}
        >
          <Text style={styles.btnText}>Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Disaster Report Verify</Text>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text>No unapproved disaster reports found.</Text>}
      />
      <VideoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        videoUrl={selectedReport?.video} // Pass the video URL here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F0FF", // Light blue background
  },
  heading: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1E3A8A", // Darker blue for heading
    marginTop: 50,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reportContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0E0FF", // Soft blue border for a subtle look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Slightly deeper shadow for a floating effect
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1D4ED8", // Primary blue color for titles
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  btn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  approveBtn: {
    backgroundColor: "#3B82F6",  // Bright blue for approve
  },
  rejectBtn: {
    backgroundColor: "#EF4444",  // Red for reject
  },
  videoBtn: {
    backgroundColor: "#60A5FA",  // Lighter blue for video
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default DisasterReports;
