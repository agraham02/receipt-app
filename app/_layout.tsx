// _layout.tsx
import { ImageProvider } from "@/context/ImageContext";
import { ReceiptProvider } from "@/context/ReceiptContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <ReceiptProvider>
            <ImageProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ title: "Home" }} />
                    {/* <Stack.Screen name="camera" options={{ title: "Camera" }} /> */}
                    <Stack.Screen
                        name="processed-text"
                        options={{ title: "Processed Text" }}
                    />
                    <Stack.Screen
                        name="edit-items"
                        options={{ title: "Edit Items" }}
                    />
                    <Stack.Screen
                        name="edit-people"
                        options={{ title: "Add/Remove People" }}
                    />
                    <Stack.Screen
                        name="item-assignment"
                        options={{ title: "Assign Items" }}
                    />
                    <Stack.Screen
                        name="split-summary"
                        options={{ title: "Summary" }}
                    />
                </Stack>
            </ImageProvider>
        </ReceiptProvider>
    );
}
