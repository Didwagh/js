import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Linking } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DisasterInfo {
  id: string;
  name: string;
  category: "Natural" | "Medical" | "Man-Made";
  preparedness: string[];
  medicalAssistance: string[];
  emergencyNumber: string;
  medicalLink: string;
}

const disasterData: DisasterInfo[] = [
  // ... (disasterData array as before)
  {
    id: "1",
    name: "Earthquake",
    category: "Natural",
    preparedness: ["Drop, Cover, and Hold On.", "Stay indoors until shaking stops.", "Move to open space if outside."],
    medicalAssistance: ["Check for injuries and provide first aid.", "Avoid using elevators.", "Call emergency services if needed."],
    emergencyNumber: "112", // India Emergency Number
    medicalLink: "https://ndma.gov.in/Natural-Hazards/Earthquake", // NDMA India Earthquake
  },
  {
    id: "2",
    name: "Tsunami",
    category: "Natural",
    preparedness: ["Move to higher ground immediately.", "Avoid coastal areas.", "Listen to emergency alerts."],
    medicalAssistance: ["Provide CPR if necessary.", "Treat injuries from debris.", "Seek medical help for hypothermia."],
    emergencyNumber: "112",
    medicalLink: "https://incois.gov.in/Tsunami.jsp", // INCOIS Tsunami Info
  },
    {
    id: "3",
    name: "Volcanic Eruption",
    category: "Natural",
    preparedness: ["Evacuate if instructed.", "Stay indoors to avoid ash.", "Wear respiratory protection."],
    medicalAssistance: ["Treat burns and respiratory issues.", "Avoid contaminated water.", "Seek medical help for injuries."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "4",
    name: "Cyclone",
    category: "Natural",
    preparedness: ["Secure your home.", "Evacuate if instructed.", "Store emergency supplies."],
    medicalAssistance: ["Treat injuries caused by flying debris.", "Avoid floodwaters.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://rsmcnewdelhi.imd.gov.in/", // IMD Cyclone Info
  },
  {
    id: "5",
    name: "Tornado",
    category: "Natural",
    preparedness: ["Seek shelter in a basement or interior room.", "Stay away from windows.", "Protect your head."],
    medicalAssistance: ["Treat injuries from debris.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "6",
    name: "Flood",
    category: "Natural",
    preparedness: ["Move to higher ground.", "Avoid walking or driving in floodwaters.", "Turn off electricity and gas."],
    medicalAssistance: ["Check for injuries.", "Avoid contaminated water.", "Seek help for hypothermia or injuries."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/Natural-Hazards/Floods", // NDMA Flood Info
  },
  {
    id: "7",
    name: "Landslide",
    category: "Natural",
    preparedness: ["Evacuate if in a risk area.", "Listen to emergency alerts.", "Avoid steep slopes during heavy rain."],
    medicalAssistance: ["Treat injuries from debris.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/Natural-Hazards/Landslide", // NDMA Landslide
  },
  {
    id: "8",
    name: "Drought",
    category: "Natural",
    preparedness: ["Conserve water.", "Prepare for water restrictions.", "Store extra water."],
    medicalAssistance: ["Treat dehydration.", "Provide water and electrolytes.", "Seek medical help for heat-related illnesses."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/Natural-Hazards/Drought", // NDMA Drought
  },
    {
    id: "9",
    name: "Wildfire / Forest Fire",
    category: "Natural",
    preparedness: ["Evacuate if instructed.", "Stay informed through official sources.", "Prepare a go-bag."],
    medicalAssistance: ["Treat burns and smoke inhalation.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "10",
    name: "Blizzard / Snowstorm",
    category: "Natural",
    preparedness: ["Stay indoors.", "Prepare emergency supplies.", "Avoid travel if possible."],
    medicalAssistance: ["Treat hypothermia and frostbite.", "Provide warm clothing and blankets.", "Seek medical help if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "11",
    name: "Hailstorm",
    category: "Natural",
    preparedness: ["Seek shelter indoors.", "Stay away from windows.", "Protect your head."],
    medicalAssistance: ["Treat injuries from hail.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "12",
    name: "Avalanche",
    category: "Natural",
    preparedness: ["Avoid backcountry travel in avalanche terrain.", "Carry avalanche safety equipment.", "Learn avalanche safety skills."],
    medicalAssistance: ["Provide CPR if necessary.", "Treat injuries from trauma.", "Seek medical help for hypothermia."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "13",
    name: "Heatwave / Extreme Heat",
    category: "Natural",
    preparedness: ["Stay hydrated.", "Seek air-conditioned environments.", "Avoid strenuous activity during peak heat."],
    medicalAssistance: ["Treat heatstroke and heat exhaustion.", "Provide cool water and electrolytes.", "Seek medical help if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ncdc.imd.gov.in/", // IMD Heatwave
  },
  {
    id: "14",
    name: "Cold Wave / Extreme Cold",
    category: "Natural",
    preparedness: ["Stay indoors.", "Wear layers of warm clothing.", "Prepare for power outages."],
    medicalAssistance: ["Treat hypothermia and frostbite.", "Provide warm blankets and drinks.", "Seek medical help if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  // 🚑 Medical Disasters & Emergencies (India Specific)
  {
    id: "15",
    name: "Pandemic / Epidemic",
    category: "Medical",
    preparedness: ["Wear masks and practice hygiene.", "Stay informed through official sources.", "Stock up on essential medications."],
    medicalAssistance: ["Seek medical advice if symptoms develop.", "Follow quarantine guidelines.", "Get vaccinated if available."],
    emergencyNumber: "1075", // National Health Helpline
    medicalLink: "https://www.mohfw.gov.in/", // Ministry of Health and Family Welfare, India
  },
  {
    id: "16",
    name: "Foodborne Illness Outbreak",
    category: "Medical",
    preparedness: ["Practice safe food handling.", "Avoid contaminated food.", "Stay informed about outbreaks."],
    medicalAssistance: ["Treat dehydration and vomiting.", "Provide electrolytes.", "Seek medical help if needed."],
    emergencyNumber: "112",
    medicalLink: "https://fssai.gov.in/", // Food Safety and Standards Authority of India
  },
  {
    id: "17",
    name: "Dehydration & Heatstroke",
    category: "Medical",
    preparedness: ["Stay hydrated.", "Avoid strenuous activity in heat.", "Seek shade or air conditioning."],
    medicalAssistance: ["Provide cool water and electrolytes.", "Cool the body with cold compresses.", "Seek medical help immediately."],
    emergencyNumber: "112",
    medicalLink: "https://www.mohfw.gov.in/", // Ministry of Health and Family Welfare, India
  },
  {
    id: "18",
    name: "Snake Bites & Animal Attacks",
    category: "Medical",
    preparedness: ["Be aware of wildlife in your area.", "Avoid provoking animals.", "Wear protective clothing when hiking."],
    medicalAssistance: ["Immobilize the affected limb.", "Seek medical help immediately.", "Identify the animal if possible."],
    emergencyNumber: "112",
    medicalLink: "https://ncdc.gov.in/index4.php?lang=1&level=0&linkid=107&lid=71", //NCDC Snakebite
  },
  {
    id: "19",
    name: "Poisoning / Toxic Exposure",
    category: "Medical",
    preparedness: ["Store chemicals safely.", "Keep medications out of reach of children.", "Read labels carefully."],
    medicalAssistance: ["Call poison control immediately.", "Follow their instructions.", "Seek medical help if needed."],
    emergencyNumber: "112",
    medicalLink: "https://aiims.edu/en/departments-centers/poison-centre.html", // AIIMS poison center
  },
  {
    id: "20",
    name: "Radiation Exposure",
    category: "Medical",
    preparedness: ["Stay indoors and seal doors/windows.", "Listen to emergency broadcasts.", "Avoid contaminated food and water."],
    medicalAssistance: ["Seek immediate decontamination.", "Take iodine tablets if recommended.", "Get medical checkups for radiation exposure."],
    emergencyNumber: "112",
    medicalLink: "https://www.aerb.gov.in/", // Atomic Energy Regulatory Board India
  },
  {
    id: "21",
    name: "Severe Allergic Reactions (Anaphylaxis)",
    category: "Medical",
    preparedness: ["Identify allergens.", "Carry an epinephrine auto-injector.", "Inform others about allergies."],
    medicalAssistance: ["Administer epinephrine immediately.", "Call emergency services.", "Seek medical help even after symptoms subside."],
    emergencyNumber: "112",
    medicalLink: "https://www.aiims.edu/", //AIIMS INDIA
  },
  {
    id: "22",
    name: "Cardiac Arrest & Stroke",
    category: "Medical",
    preparedness: ["Maintain a healthy lifestyle.", "Learn CPR.", "Recognize the signs of stroke."],
    medicalAssistance: ["Perform CPR if needed.", "Call emergency services immediately.", "Seek medical help for stroke symptoms."],
    emergencyNumber: "112",
    medicalLink: "https://www.nhp.gov.in/", //National Health Portal India
  },
  {
    id: "23",
    name: "Drowning & Water Accidents",
    category: "Medical",
    preparedness: ["Learn to swim.", "Supervise children near water.", "Avoid swimming alone."],
    medicalAssistance: ["Perform CPR if needed.", "Remove the person from water.", "Seek medical help immediately."],
    emergencyNumber: "112",
    medicalLink: "https://www.nhp.gov.in/", //National Health Portal India
  },
  {
    id: "24",
    name: "Infectious Diseases",
    category: "Medical",
    preparedness: ["Practice good hygiene.", "Get vaccinated.", "Avoid contact with infected individuals."],
    medicalAssistance: ["Seek medical help for symptoms.", "Follow treatment guidelines.", "Isolate if necessary."],
    emergencyNumber: "1075",
    medicalLink: "https://www.mohfw.gov.in/", //Ministry of health and family welfare india.
  },
  // 💥 Man-Made Disasters (India Specific)
  {
    id: "25",
    name: "Nuclear Accident / Radiation Leak",
    category: "Man-Made",
    preparedness: ["Stay indoors and seal all doors/windows.", "Avoid drinking tap water.", "Follow evacuation orders."],
    medicalAssistance: ["Remove contaminated clothing.", "Wash exposed skin with soap and water.", "Seek medical treatment for radiation sickness."],
    emergencyNumber: "112",
    medicalLink: "https://www.aerb.gov.in/", // Atomic Energy Regulatory Board India
  },
  {
    id: "26",
    name: "Chemical Spill / Hazardous Material Release",
    category: "Man-Made",
    preparedness: ["Evacuate the area if necessary.", "Avoid contact with the substance.", "Follow emergency services' instructions."],
    medicalAssistance: ["Remove contaminated clothing.", "Flush skin and eyes with clean water.", "Seek medical attention for exposure symptoms."],
    emergencyNumber: "112",
    medicalLink: "https://ncrms.gov.in/", //National Chemical Emergency Response System
  },
  {
    id: "27",
    name: "Industrial Explosion",
    category: "Man-Made",
    preparedness: ["Evacuate the area immediately.", "Follow emergency services' instructions.", "Avoid debris and smoke."],
    medicalAssistance: ["Treat burns and injuries from debris.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://dgefasli.gov.in/", //Directorate General Factory Advice Service & Labour Institutes
  },
  {
    id: "28",
    name: "Oil Spill & Environmental Contamination",
    category: "Man-Made",
    preparedness: ["Avoid contaminated areas.", "Follow evacuation orders.", "Stay informed through official sources."],
    medicalAssistance: ["Treat respiratory problems and skin irritation.", "Seek medical help if exposed.", "Avoid consuming contaminated food and water."],
    emergencyNumber: "112",
    medicalLink: "https://cpcb.nic.in/", //Central Pollution Control Board India
  },
  {
    id: "29",
    name: "Building Collapse",
    category: "Man-Made",
    preparedness: ["Evacuate if instructed.", "Seek shelter under sturdy objects.", "Avoid damaged structures."],
    medicalAssistance: ["Treat injuries from debris.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "30",
    name: "Bridge / Infrastructure Failure",
    category: "Man-Made",
    preparedness: ["Avoid damaged structures.", "Follow detours and road closures.", "Stay informed through official sources."],
    medicalAssistance: ["Treat injuries from trauma.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://morth.gov.in/", //Ministry of Road Transport and Highways India
  },
  {
    id: "31",
    name: "Dam Failure",
    category: "Man-Made",
    preparedness: ["Evacuate if in a flood zone.", "Move to higher ground.", "Listen to emergency alerts."],
    medicalAssistance: ["Treat injuries from floodwaters.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://cwc.gov.in/", //Central Water Commission India
  },
  {
    id: "32",
    name: "Transport Accidents",
    category: "Man-Made",
    preparedness: ["Follow safety guidelines when traveling.", "Be aware of your surroundings.", "Prepare for potential delays."],
    medicalAssistance: ["Treat injuries from trauma.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://morth.gov.in/", //Ministry of Road Transport and Highways India
  },
  {
    id: "33",
    name: "Stampede & Crowd Disasters",
    category: "Man-Made",
    preparedness: ["Avoid crowded areas if possible.", "Be aware of exits.", "Stay calm and follow instructions."],
    medicalAssistance: ["Treat injuries from trampling.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://ndma.gov.in/", //NDMA INDIA
  },
  {
    id: "34",
    name: "Mine Disaster",
    category: "Man-Made",
    preparedness: ["Follow safety protocols in mining areas.", "Be aware of potential hazards.", "Prepare for emergencies."],
    medicalAssistance: ["Treat injuries from explosions and cave-ins.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://dms.gov.in/", //Directorate General of Mines Safety India
  },
  {
    id: "35",
    name: "Power Outages & Blackouts",
    category: "Man-Made",
    preparedness: ["Prepare emergency lighting and power sources.", "Stock up on non-perishable food.", "Stay informed about outages."],
    medicalAssistance: ["Treat injuries from falls in the dark.", "Provide warmth if needed.", "Seek medical help for those reliant on medical devices."],
    emergencyNumber: "112",
    medicalLink: "https://powermin.gov.in/", //Ministry of Power India
  },
  {
    id: "36",
    name: "Gas Leaks & Explosions",
    category: "Man-Made",
    preparedness: ["Install gas detectors.", "Know the signs of a gas leak.", "Evacuate if a leak is suspected."],
    medicalAssistance: ["Treat burns and respiratory problems.", "Provide first aid.", "Call emergency services if needed."],
    emergencyNumber: "112",
    medicalLink: "https://pngrb.gov.in/", //Petroleum and Natural Gas Regulatory Board India
  },
];

const DisasterPreparednessScreen: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const callEmergencyNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const openMedicalLink = (link: string) => {
    Linking.openURL(link);
  };

  const filteredData = selectedCategory
    ? disasterData.filter((item) => item.category === selectedCategory)
    : disasterData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>India Disaster Preparedness Guide</Text>

      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="All Categories" value={null} />
        <Picker.Item label="Natural" value="Natural" />
        <Picker.Item label="Medical" value="Medical" />
        <Picker.Item label="Man-Made" value="Man-Made" />
      </Picker>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={[styles.title, getCategoryStyle(item.category)]}>
                {item.name}
              </Text>
            </TouchableOpacity>

            {expanded === item.id && (
              <View style={styles.content}>
                <Text style={styles.subHeader}>Preparedness:</Text>
                {item.preparedness.map((step, index) => (
                  <Text key={index} style={styles.step}>🔹 {step}</Text>
                ))}

                <Text style={styles.subHeader}>Medical Assistance:</Text>
                {item.medicalAssistance.map((step, index) => (
                  <Text key={index} style={styles.step}>💊 {step}</Text>
                ))}

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => callEmergencyNumber(item.emergencyNumber)}
                >
                  <Text style={styles.callText}>📞 Emergency: {item.emergencyNumber}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => openMedicalLink(item.medicalLink)}
                >
                  <Text style={styles.linkText}>🌐 More Info</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
};

const getCategoryStyle = (category: "Natural" | "Medical" | "Man-Made") => {
  switch (category) {
    case "Natural":
      return styles.naturalTitle;
    case "Medical":
      return styles.medicalTitle;
    case "Man-Made":
      return styles.manMadeTitle;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F4F4" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  card: { backgroundColor: "#FFF", padding: 16, marginVertical: 8, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, elevation: 2 },
  title: { fontSize: 18, fontWeight: "bold" },
  naturalTitle: { color: "#0066CC" },
  medicalTitle: { color: "#CC0000" },
  manMadeTitle: { color: "#FF8800" },
  content: { marginTop: 10 },
  subHeader: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  step: { fontSize: 16, marginVertical: 4, color: "#555" },
  callButton: { backgroundColor: "#ff4444", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  callText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { backgroundColor: "#008CBA", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  linkText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});

export default DisasterPreparednessScreen;