import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';




const TabIcon = () => {

};

const Layout = () => {
  return (
    <Tabs initialRouteName="index" screenOptions={{ 
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 12 },}}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cloud-upload' : 'cloud-upload-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listDisaster"
        options={{
          title: 'Disasters',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="helpUs"
        options={{
          title: 'Help',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'help' : 'help-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="approveUser"
        options={{
          title: 'Approve',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkmark' : 'checkmark-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
