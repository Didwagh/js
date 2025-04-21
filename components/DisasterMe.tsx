import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useGlobalContext } from "@/context/GlobalProvider";

const API_KEY = "xffYn9s7Jp-gM_RScww8oMP5I1NOBNTus1G73dlW";
const BASE_URL = "https://api.predicthq.com/v1";

interface DisasterNearMeProps {
  onEventsFetched: (events: any[]) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  bucketStorage: {
    state: string | null;
  };
}

const DisasterNearMe: React.FC<DisasterNearMeProps> = ({
  onEventsFetched,
  onError,
  onLoading,
  bucketStorage,
}) => {
  const { user } = useGlobalContext();

  const fetchDisastersNearMe = async () => {
    onLoading(true);

    try {
      // const data = await AsyncStorage.getItem("locationData");
      if (true) {
        // const parsedData = JSON.parse(data);
        const district = user.city || "";

        const url = `${BASE_URL}/events?q=${encodeURIComponent(
          district
        )}&limit=10&sort=start&category=disasters`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        onEventsFetched(response.data.results);
      }
    } catch (error) {
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchDisastersNearMe}>
        <Text style={styles.buttonText}>Disaster Near Me</Text>
      </TouchableOpacity>
    </View>
  );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
      alignItems: "center",
    },
  
    // Aqua blue modern button
    button: {
      backgroundColor: "#00B4D8", // Your chosen color
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 30, // Fully rounded for modern look
      shadowColor: "#00B4D8",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4, // Android shadow
    },
  
    // Button text
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
  });
  

export default DisasterNearMe;
