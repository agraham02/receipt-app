import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen
                name="camera"
                options={{ title: "Processed Text" }}
            />
            <Stack.Screen
                name="processed-text"
                options={{ title: "Processed Text" }}
            />
        </Stack>
    );
}
