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
      <Text style={styles.navbarText}>Disaster App</Text>
      <TouchableOpacity onPress={handleToggle} style={styles.menuButton}>
        {isMenuOpen ? (
          <Entypo name="cross" size={25} color="#03045E" />
        ) : (
          <Entypo name="menu" size={25} color="#03045E" />
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,   
    backgroundColor: "#90E0EF",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  navbarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#023E8A",
    fontStyle: "italic",
  },
  menuButton: {
    padding: 5,
    borderRadius: 8,
  },
  menu: {
    position: "absolute",
    top: 48,  // shifted slightly up because navbar is now shorter
    right: 10,
    width: "70%",
    backgroundColor: "#EAF6FF",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
});
