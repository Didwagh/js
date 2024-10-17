
import { Stack, Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';




const TabIcon = () => {

};

const Layout = () => {
  return (
    <Tabs initialRouteName="index" screenOptions={{ tabBarActiveTintColor: 'black' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cloud-upload' : 'cloud-upload-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listDisaster"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
