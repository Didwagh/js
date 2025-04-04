import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useGlobalContext } from "@/context/GlobalProvider";
import {  MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Navbar from "@/components/Navbar";
const Layout = () => {
  const { user } = useGlobalContext();
  console.log(user);
  // const isAdmin= user.role !== 'user' &&  user.role!=='volunteer' && user.role !== 'ngo'
  // const isAdmin = user.email === "admin@gmail.com" || "admin1@gmail.com";
  const isAdmin = user.role === 'Admin'
  console.log(isAdmin);
  const isUser = user.role === 'User'
  console.log(isUser);
  const isVolunteer = !isAdmin && !isUser;
  console.log(isVolunteer);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#1ea2ff", // Active icon color (when focused)
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          href: "/home", // Specify href here
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: "/(root)/searchBar", // Specify href here
          title: "",
          // headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search"}
              color={color}
            />
          ),
        }}
      />
      {(isUser || isVolunteer) && <Tabs.Screen
      // <Tabs.Screen
        name="upload"
        options={{
          href: "/upload", // Specify href here
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cloud-upload" : "cloud-upload-outline"}
              color={color}
            />
          ),
        }}
      />}

      <Tabs.Screen
        name="listDisaster"
        options={{
          href: isVolunteer ? "/listDisaster" : null,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "clipboard" : "clipboard-outline"}
              // name={focused ? "list-sharp" : "list"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="approveUser"
        options={{
          href: isAdmin ? "/approveUser" : null,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "checkmark" : "checkmark-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="helpUs"
        options={{
          href: isVolunteer ? "/helpUs" : null,
          title: "reports",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon
            //   name={focused ? "help" : "help-outline"}
            //   color={color}
            // />
            <MaterialIcons
              name={focused ? "report" : "report"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="disasterInfo"
        options={{
          href: "/disasterInfo",
          title: "Info",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "information-circle" : "information"}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="homepage"
        options={{
          href: "/homepage",
          title: "homepage",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "help-circle" : "help"} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="details"
        options={{
          href: "/details",
          title: "detail",
          // headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              // name={focused ? "details" : "details"}
              name={"details"}
              size={28}
              color={color}
            />
          ),
          // header: ({ navigation }) => (
          //   <Navbar navigation={navigation} /> // Use custom Navbar as header
          // ),


          // headerStyle: { backgroundColor: "skyblue" },
          // headerTintColor: "#fff",
          // headerTitleStyle: { fontWeight: "bold" },
          // // Add a menu button to the left of the header
          // headerRight: () => (
          //   <TouchableOpacity onPress={() => alert("Menu button pressed")}>
          //     <TabBarIcon
          //       name="menu"
          //       size={30}
          //       color="#fff"
          //       style={{ paddingHorizontal: 10 }}
          //     />
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
