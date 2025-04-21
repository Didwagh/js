// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Button,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useThemeColor } from "@/hooks/useThemeColor";
// import DisasterNearMe from "@/components/DisasterMe";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface BucketStorage {
//   latitude: string | null;
//   longitude: string | null;
//   state: string | null;
//   district: string | null;
// }

// interface Event {
//   id: string;
//   title: string;
//   description?: string;
//   category?: string;
//   labels?: string[];
//   start: string;
//   end: string;
//   geo?: {
//     geometry?: {
//       coordinates?: [number, number];
//     };
//     address?: {
//       city?: string;
//       district?: string;
//       country_code?: string;
//     };
//   };
//   timezone?: string;
//   state?: string;
// }

// // const API_KEY = 'HFEefhit2ZKqfj_IKjCrJU-07wG4_7R7tMJnrorz';
// // const API_KEY = "RwGqA_Ogj2jVNF-eLAh8ruxqhmrW_IepZBGtbAJC";
// const API_KEY = "xffYn9s7Jp-gM_RScww8oMP5I1NOBNTus1G73dlW";

// const BASE_URL = "https://api.predicthq.com/v1";

// const Index: React.FC = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [nextUrl, setNextUrl] = useState<string | null>(null); // For pagination
//   const [location, setLocation] = useState<string>(""); // Location input
//   const [query, setQuery] = useState<string>(""); // Input for fetching events

//   // Use theme colors
//   const backgroundColor = useThemeColor(
//     { light: "#ffffff", dark: "#000000" },
//     "background"
//   );
//   const textColor = useThemeColor(
//     { light: "#000000", dark: "#ffffff" },
//     "text"
//   );

//   // BucketStorage
//   const [bucketStorage, setBucketStorage] = useState<BucketStorage>({
//     latitude: null,
//     longitude: null,
//     state: null,
//     district: null,
//   });

//   useEffect(() => {
//     const loadLocationData = async () => {
//       try {
//         const data = await AsyncStorage.getItem("locationData");
//         if (data) {
//           const parsedData = JSON.parse(data);
//           setBucketStorage({
//             latitude: parsedData.latitude || "latitude not found",
//             longitude: parsedData.longitude || "longitude not found",
//             state: parsedData.state || "State not found",
//             district: parsedData.district || "District not found",
//           });
//         }
//       } catch (error) {
//         console.error("Failed to load location data from AsyncStorage:", error);
//       }
//     };

//     loadLocationData();
//   }, []);

//   const fetchEvents = async (url: string) => {
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//         },
//       });

//       setEvents((prevEvents) => [
//         ...prevEvents,
//         ...response.data.results.filter(
//           (event: Event) =>
//             !prevEvents.some((e) => e.id === event.id) &&
//             event.category === "disasters"
//         ),
//       ]);

//       setNextUrl(response.data.next || null);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllEvents = async () => {
//     if (!query) return;

//     setLoading(true);
//     setEvents([]);

//     let url = `${BASE_URL}/events?q=${encodeURIComponent(
//       query
//     )}&limit=10&sort=start&category=disasters`;
//     while (url) {
//       await fetchEvents(url);
//       url = nextUrl || "";
//     }
//   };

//   useEffect(() => {
//     if (query) {
//       fetchAllEvents();
//     }
//   }, [query]);

//   const handleSearch = () => {
//     setQuery(location);
//   };

//   const loadMoreEvents = () => {
//     if (nextUrl) {
//       setLoading(true);
//       fetchEvents(nextUrl);
//     }
//   };

//   const handleEventsFetched = (newEvents: Event[]) => {
//     setEvents(newEvents);
//   };

//   const handleError = (error: string) => {
//     setError(error);
//   };

//   const handleLoading = (loading: boolean) => {
//     setLoading(loading);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Search Input & Button Block */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Enter location (e.g., Mumbai, India)"
//           placeholderTextColor="#8FA3BF"
//           value={location}
//           onChangeText={setLocation}
//         />
//         <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
//           <Text style={styles.searchButtonText}>Search</Text>
//         </TouchableOpacity>
//       </View>
  
//       {/* Event Fetch Component */}
//       <DisasterNearMe
//         onEventsFetched={handleEventsFetched}
//         onError={handleError}
//         onLoading={handleLoading}
//         bucketStorage={bucketStorage}
//       />
  
//       {loading && !events.length ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0077CC" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       ) : (
//         <>
//           {events.length > 0 ? (
//             <FlatList
//               data={events}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.event}>
//                   <Text style={styles.eventTitle}>{item.title}</Text>
//                   <Text style={styles.eventDetail}>Date: {item.start}</Text>
//                   <Text style={styles.eventDetail}>
//                     Category: {item.category || "Not available"}
//                   </Text>
//                   {item.labels?.length > 0 && (
//                     <Text style={styles.eventDetail}>
//                       Labels: {item.labels.join(", ")}
//                     </Text>
//                   )}
//                   {item.geo?.address?.city || item.geo?.address?.district ? (
//                     <Text style={styles.eventDetail}>
//                       Location: {item.geo.address.city || item.geo.address.district}
//                     </Text>
//                   ) : (
//                     <Text style={styles.eventDetail}>Location: Not available</Text>
//                   )}
//                   {item.timezone && (
//                     <Text style={styles.eventDetail}>Timezone: {item.timezone}</Text>
//                   )}
//                   {item.state && (
//                     <Text style={styles.eventDetail}>Status: {item.state}</Text>
//                   )}
//                 </View>
//               )}
//             />
//           ) : (
//             <Text style={styles.noEventsText}>No events found.</Text>
//           )}
  
//           {/* Load More Button */}
//           {nextUrl && events.length >= 10 && (
//             <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreEvents}>
//               <Text style={styles.loadMoreButtonText}>Load More</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//     </SafeAreaView>
//   );
//   };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#F5FAFF", // light blueish background
//   },

//   // Search section container
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//     marginTop: 10,
//     width: "100%",
//     backgroundColor: "#E3F2FD", // Light blue highlight
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 12,
//     borderColor: "#B5C9EA", // Soft blue-gray border
//     borderWidth: 1,
//     shadowColor: "#0077CC",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//     elevation: 2,
//   },

//   // Input field for location
//   searchInput: {
//     flex: 1,
//     height: 44,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: "#03045E", // Dark blue text
//   },

//   // Search button
//   searchButton: {
//     backgroundColor: "#0077CC",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginLeft: 10,
//   },

//   // Text inside search button
//   searchButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   // Each event card
//   event: {
//     backgroundColor: "#ffffff",
//     padding: 20,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#E0ECF7",
//     marginBottom: 16,
//     shadowColor: "#0077CC",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },

//   eventTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#03045E", // Deep blue
//   },

//   eventDetail: {
//     fontSize: 14,
//     color: "#37474F", // Cool gray
//     marginBottom: 4,
//   },

//   // Loading spinner and text container
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   loadingText: {
//     color: "#0077CC",
//     marginTop: 8,
//     fontSize: 16,
//   },

//   // If no events found
//   noEventsText: {
//     color: "#37474F",
//     textAlign: "center",
//     fontSize: 16,
//     marginTop: 20,
//   },

//   // "Load More" button style
//   loadMoreButton: {
//     backgroundColor: "#0077CC",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignSelf: "center",
//     marginTop: 20,
//   },

//   loadMoreButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default Index;
