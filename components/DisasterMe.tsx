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
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default DisasterNearMe;
