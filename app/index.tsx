import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Link } from "expo-router";

export default function Index() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(
        undefined
    );

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result);
            setSelectedImage(result.assets[0].uri);
        } else {
            alert("You did not select any image.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer selectedImage={selectedImage} />
            </View>
            <View style={styles.footerContainer}>
                <Link href="/camera" asChild>
                    <Button theme="primary" label="Take photo" icon="camera" />
                </Link>
                <Button
                    theme="primary"
                    label="Choose a photo"
                    onPress={pickImageAsync}
                    icon={"picture-o"}
                />
                <Button label="Use this photo" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
    },
    imageContainer: {
        flex: 1,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
});
