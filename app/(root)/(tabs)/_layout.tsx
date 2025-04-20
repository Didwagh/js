import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome5, MaterialIcons, Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Navbar from "@/components/Navbar";
const Layout = () => {
  const { user } = useGlobalContext();
  console.log(user);

  // Normalize the user role
  const userRole = user?.role ?? "User"; // Default to "User" if role is null or undefined

  const isUser = userRole === "User";
  const isAdmin = userRole === "Admin";
  const isVolunteer = userRole === "Volunteer";
  const isNgo = userRole === "NGO";


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
          href: isUser || isVolunteer ? "/(root)/searchBar" : null,
          title: "",
          // headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search" : "search"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        // <Tabs.Screen
        name="upload"
        options={{
          href: isUser || isVolunteer ? "/upload" : null, // Specify href here
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cloud-upload" : "cloud-upload-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="listDisaster"
        options={{
          href: isAdmin ? "/listDisaster" : null,
          // href: "/listDisaster" ,
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
          // href: isVolunteer ? "/helpUs" : null,
          href: "/helpUs",
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
          href: !isAdmin ? "/disasterInfo" : null,
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
      <Tabs.Screen
        name="Donation/DonationForm"
        options={{
          href: null,
          title: "Donate",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="donate" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Donation/DonationPage"
        options={{
          href: isUser || isVolunteer ? "/Donation/DonationPage" : null,
          // title: "Donate & Help",
          title: "",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Donation/PostRequirementForm"
        options={{
          href: isNgo ? "/Donation/PostRequirementForm" : null,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "post-add" : "post-add"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PaymentEventsPage"
        options={{
          href: isAdmin ? "/PaymentEventsPage":null ,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="payment" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="PaymentEventDetailPage"
        options={{
          href: null,
          title: "",
          headerShown: false,
          // tabBarIcon: ({ color, focused }) => (
          //   <MaterialIcons name="volunteer-activism" color={color} size={26} />
          // ),
        }}
      />
      <Tabs.Screen
        name="chatBot"
        options={{
          href: !isAdmin ? "/chatBot" : null,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Octicons name="dependabot" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          href: isUser ? "/sos" : null,
          title: "SOS",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "post-add" : "post-add"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sosView"
        options={{
          href: isAdmin ? "/sosView" : null,
          title: "SOS Reports",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "post-add" : "post-add"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="VolunteerReportsPage"
        options={{
          href: isAdmin ? "/VolunteerReportsPage" : null,
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="volunteer-activism" color={color} size={26} />
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
          // href: "/details",
          href: null,
          title: "",
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
