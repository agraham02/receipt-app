// processed-text.tsx
import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect } from "react";
// import { useSearchParams } from "expo-router";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { ImageContext } from "@/context/ImageContext";

export default function ProcessedText() {
    const { selectedImage } = useContext(ImageContext);

    useEffect(() => {
        const processImage = async () => {
            console.log("Hello");
            console.log(selectedImage?.uri);
            if (!selectedImage?.uri) return;

            try {
                const text = await TextRecognition.recognize(selectedImage.uri);
                console.log(text);
            } catch (error) {
                console.log(error);
            }
        };

        processImage();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Processed Text</Text>
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
