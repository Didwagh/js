import { Redirect } from "expo-router";
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
const Page = () => {
    return <Redirect href="/(auth)/welcome" />
};

export default Page;