import { View, StyleSheet, Text } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
//  import {ArrowLeftIcon} from '@expo/vector-icons'
import AntDesign from "@expo/vector-icons/AntDesign";

interface ButtonComponentProps {
  page: number;
  setPage: (page: number) => void;
  lastPage: number;
}
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

  const buttonStyle = (isDisabled: boolean) => ({
    ...styles.button,
    opacity: isDisabled ? 0.5 : 1,
  });

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={handlePrev}
        style={buttonStyle(disablePrevButton)}
        disabled={disablePrevButton}
        accessibilityLabel="Previous Page"
      >
        <AntDesign name="left" size={24} color="white" />      
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNext}
        style={buttonStyle(disableNextButton)}
        disabled={disableNextButton}
        accessibilityLabel="Next Page"
      >
        <AntDesign name="right" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left:-20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: 50,
    backgroundColor: "#4169E1",
  },

});

export default ButtonComponent;
