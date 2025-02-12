import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function ProcessedText() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>ProcessedText</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
    },
});
