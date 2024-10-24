import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorText}>
          This screen doesn't exist.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedView style={styles.button}>
            <ThemedText type="link" style={styles.buttonText}>
              Go to Home Screen!
            </ThemedText>
          </ThemedView>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc'
  },
  errorText: {
    fontSize: 22, 
    color: '#333', 
    marginBottom: 20, 
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#007bff', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16, 
    // fontWeight: '600', 
    textAlign: 'center',
  },
});
