import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import { Client, Databases, Models } from "react-native-appwrite";
import {
  getUnapprovedDisasterReports,
  updateDisasterReportApproval,
} from "@/lib/appwrite";
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
        const locationDataString = await AsyncStorage.getItem("locationData");
        if (locationDataString) {
          const locationData = JSON.parse(locationDataString);
          setUserCity(locationData.city);
        }
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
          style={styles.btn}
          onPress={() => handleApprove(item.$id)}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#ef4256" }]}
          onPress={() => handleApprove(item.$id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#0a92f5" }]}
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
    width: "100%",
    height: "100%",
    // backgroundColor:'red'
  },
  listContainer: {
    padding: 20,
  },
  reportContainer: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  heading: {
    // marginVertical: 10,
    fontSize:20,
    textAlign:"center",
    fontWeight:"bold",
    marginTop:'10%',
    padding: 10,
    // color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    fontSize: 12,
    backgroundColor: "#1254ff",
    marginVertical: 7,
  },
  btnText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default DisasterReports;
