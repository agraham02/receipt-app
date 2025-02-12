import { Link } from "expo-router";
import { Button, Text, View, StyleSheet } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Button title="Take Photo" />
            <Link href="/processed-text">page</Link>
            <Link href="/image-select">Image Select</Link>

            <Button title="Upload Photo" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
    },
});
