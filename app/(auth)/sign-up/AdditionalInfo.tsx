import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';


const { width, height } = Dimensions.get("screen");
const AdditionalInfo = ({ additionalInfo, setAdditionalInfo }: any) => {
  return (
    <View style={styles.pageStyle}>
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
});
