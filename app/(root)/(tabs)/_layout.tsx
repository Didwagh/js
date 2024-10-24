import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useGlobalContext } from '@/context/GlobalProvider';

const Layout = () => {
  const { user } = useGlobalContext();
  console.log(user);

  const isAdmin = user.email === 'admin@gmail.com';
  console.log(isAdmin);
  const isVolunteer = user.role != "User"
  console.log(isVolunteer)

  return (
    <Tabs initialRouteName="index" screenOptions={{ tabBarActiveTintColor: 'black' }}>
      <Tabs.Screen
        name="home"
        options={{
          href: '/home', // Specify href here
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
          href: '/upload', // Specify href here
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
            href: isVolunteer ? '/listDisaster' : null,
      
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
          ),
        }}
      />
   
        <Tabs.Screen
          name="approveUser"
          options={{
            href: isAdmin ? '/approveUser' : null,
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
            ),
          }}
        />
     
      <Tabs.Screen
        name="helpUs"
        options={{
          href: isVolunteer ? '/helpUs' : null,
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
