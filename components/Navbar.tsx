import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Drawer from "./Drawer";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <View>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}></Text>
        <TouchableOpacity onPress={handleToggle} >
          {isMenuOpen ? (
            <Entypo name="cross" size={25} />
          ) : (
            <Entypo name="menu" size={25} />
          )}
        </TouchableOpacity>
      </View>
      {isMenuOpen && (
        <View style={styles.menu}>
          <Drawer />
        </View>
      )}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 7,
    justifyContent: "space-between",
    backgroundColor: "#dfdfdf",
    zIndex: 2,
  },
  navbarText: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: "70%",
    zIndex: 1,
  },
});
