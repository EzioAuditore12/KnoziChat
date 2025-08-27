import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text variant="h1">This screen does not exist.</Text>
        <Text variant="p">
          Sorry, we could not find the page you are looking for.
        </Text>
        <Text variant="blockquote">Please check the URL or return home.</Text>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <Text variant="large" className="text-blue-500 underline">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
