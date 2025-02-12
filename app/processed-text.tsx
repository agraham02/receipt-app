// processed-text.tsx
import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router";

export default function ProcessedText() {
    const { imageUri } = useSearchParams<{ imageUri: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Processed Text</Text>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="contain"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    text: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 400,
    },
});
