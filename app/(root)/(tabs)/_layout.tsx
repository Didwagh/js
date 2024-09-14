
import { Stack, Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';




const TabIcon = () => {

};

const Layout = () => {
  return (
    <Tabs initialRouteName="index" screenOptions={{ tabBarActiveTintColor: 'white' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'upload',
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
