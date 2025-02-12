// _layout.tsx
import { ImageProvider } from "@/context/ImageContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <ImageProvider>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                {/* <Stack.Screen name="camera" options={{ title: "Camera" }} /> */}
                <Stack.Screen
                    name="processed-text"
                    options={{ title: "Processed Text" }}
                />
            </Stack>
        </ImageProvider>
    );
}
