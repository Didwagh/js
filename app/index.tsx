import { Redirect } from "expo-router";
import * as Notifications from 'expo-notifications';
import { StripeProvider } from '@stripe/stripe-react-native';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
const Page = () => {

    return (
        <StripeProvider publishableKey="pk_test_51Q0FO1EbRj0WSXtQV1VMsH75D6b27Ejax3EnsAvGLTS3W6tGQPEYPpRlsCqQNOoullS2VpK65Mk7mQaSeprXqtfM00wPPlkYJg">
            <Redirect href="/(auth)/welcome" />
        </StripeProvider>

    )
};

export default Page;