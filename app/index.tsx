// index.tsx
import { View, StyleSheet, Alert } from "react-native";
import React, { useContext, useState } from "react";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { ImageContext } from "@/context/ImageContext";

export default function Index() {
    const { selectedImage, setSelectedImage } = useContext(ImageContext);
    const router = useRouter();

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result);
            setSelectedImage(result.assets[0]);
        } else {
            Alert.alert("No image selected", "You did not select any image.");
        }
    };

    const handleUsePhoto = () => {
        if (selectedImage) {
            router.push({
                pathname: "/processed-text",
            });
        } else {
            Alert.alert("No image", "Please select an image first.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={{}} selectedImage={selectedImage} />
            </View>
            <View style={styles.footerContainer}>
                {/* <Link href="/camera">
                    <Button theme="primary" label="Take photo" icon="camera" />
                    Take a photo
                </Link> */}
                <Button
                    theme="primary"
                    label="Choose a photo"
                    onPress={pickImageAsync}
                    icon="picture-o"
                />
                <Button label="Use this photo" onPress={handleUsePhoto} />
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
        justifyContent: "center",
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
});
