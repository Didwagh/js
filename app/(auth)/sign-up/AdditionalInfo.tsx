import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get("screen");
const AdditionalInfo = ({ additionalInfo, setAdditionalInfo }: any) => {
  return (
    <View style={styles.pageStyle}>
      <Text style={styles.text}>Additional Information</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="home-outline" size={24} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your Permanent Address"
          placeholderTextColor="#ccc"
          value={additionalInfo.address}
          onChangeText={(text) =>
            setAdditionalInfo({ ...additionalInfo, address: text })
          }
          accessible={true}
          accessibilityLabel="Address Input"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="business-outline" size={24} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#ccc"
          value={additionalInfo.city}
          onChangeText={(text) =>
            setAdditionalInfo({ ...additionalInfo, city: text })
          }
          accessible={true}
          accessibilityLabel="City Input"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="map-outline" size={24} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#ccc"
          value={additionalInfo.state}
          onChangeText={(text) =>
            setAdditionalInfo({ ...additionalInfo, state: text })
          }
          accessible={true}
          accessibilityLabel="State Input"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="earth-outline" size={24} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#ccc"
          value={additionalInfo.country}
          onChangeText={(text) =>
            setAdditionalInfo({ ...additionalInfo, country: text })
          }
          accessible={true}
         accessibilityLabel="Country Input"
        />
      </View>

    </View>
  );
};

export default AdditionalInfo;


const styles = StyleSheet.create({
  pageStyle: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    height: height,
  },
  bottom: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
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
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    padding: 5,
  },
});
