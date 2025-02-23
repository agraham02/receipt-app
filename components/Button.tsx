import React, { forwardRef } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { Link } from "expo-router"; // or any Link component you use
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
    label: string;
    theme?: "primary";
    onPress?: () => void;
    icon?: string;
    href?: string; // optional link property
};

// Wrap the content in a forwardRef component so it can receive a ref from Link's asChild
const ButtonContent = forwardRef<Pressable, Props>(
    ({ label, theme, onPress, icon }, ref) => (
        <View
            style={[
                styles.buttonContainer,
                theme === "primary" && styles.primaryContainer,
            ]}
        >
            <Pressable
                ref={ref}
                style={({ pressed }) => [
                    styles.button,
                    theme === "primary"
                        ? styles.primaryButton
                        : styles.defaultButton,
                    pressed && styles.pressed,
                ]}
                onPress={onPress}
            >
                {icon && (
                    <FontAwesome
                        name={icon}
                        size={18}
                        color={theme === "primary" ? "#25292e" : "#fff"}
                        style={styles.buttonIcon}
                    />
                )}
                <Text
                    style={[
                        styles.buttonLabel,
                        theme === "primary" && styles.primaryLabel,
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        </View>
    )
);

export default function Button({ label, theme, onPress, icon, href }: Props) {
    // If href is provided, wrap ButtonContent in a Link (which will pass its ref to ButtonContent)
    if (href) {
        return (
            <Link href={href} asChild>
                <ButtonContent
                    label={label}
                    theme={theme}
                    onPress={onPress}
                    icon={icon}
                />
            </Link>
        );
    }

    return (
        <ButtonContent
            label={label}
            theme={theme}
            onPress={onPress}
            icon={icon}
        />
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        alignSelf: "center", // centers the container
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        // backgroundColor: "#28a745",
        // padding: 12,
        // alignItems: "center",
        // borderRadius: 8,
        // marginTop: 16,
    },
    primaryContainer: {
        borderWidth: 2,
        borderColor: "#ffd33d",
        borderRadius: 20,
    },
    button: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 16,
    },
    primaryButton: {
        backgroundColor: "#28a745", // Green background
    },
    defaultButton: {
        backgroundColor: "#28a745",
    },
    pressed: {
        opacity: 0.75,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    primaryLabel: {
        color: "#25292e",
    },
});
