import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import Button from "@/components/Button";

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} label="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraFacing}
                    >
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: "80%",
        height: "80%",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
