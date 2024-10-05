import { View, StyleSheet, Text } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
//  import {ArrowLeftIcon} from '@expo/vector-icons'
 import AntDesign from "@expo/vector-icons/AntDesign";
const ButtonComponent = ({ page, setPage, lastPage }: any) => {
  const handleNext = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };
  const handlePrev = () => {
    if (page >= 1) {
      setPage(page - 1);
    }
  };
  const disableNextButton = page === lastPage;
  const disablePrevButton = page === 1;
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={handlePrev}
        style={styles.button}
        disabled={disablePrevButton}
      >
      <AntDesign name="left" size={24} color={page === 1 ? "gray" : "white"}  />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNext}
        style={styles.button}
        disabled={disableNextButton}
      >
        <AntDesign name="right" size={24} color={page === lastPage ? "gray" : "white"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: -20,
    left:-20,
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

export default ButtonComponent;
