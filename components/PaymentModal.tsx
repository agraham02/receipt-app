// PaymentModal.tsx
import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
} from "react-native";
import { PaymentOption } from "./types"; // Adjust the path if needed

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    paymentOptions: PaymentOption[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    visible,
    onClose,
    paymentOptions,
}) => {
    const renderPaymentOption = ({ item }: { item: PaymentOption }) => {
        return (
            <View style={styles.optionContainer}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                {item.type === "qr" && item.image ? (
                    <Image
                        source={item.image}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                ) : item.type === "handle" && item.value ? (
                    <Text style={styles.handleText}>{item.value}</Text>
                ) : item.type === "link" && item.value ? (
                    <Text style={styles.linkText}>{item.value}</Text>
                ) : null}
            </View>
        );
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Payment Options</Text>
                    <FlatList
                        data={paymentOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPaymentOption}
                        contentContainerStyle={styles.optionsList}
                    />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        maxHeight: "80%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    optionsList: {
        width: "100%",
    },
    optionContainer: {
        alignItems: "center",
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
    },
    optionLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    qrImage: {
        width: 150,
        height: 150,
    },
    handleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007bff",
    },
    linkText: {
        fontSize: 16,
        color: "#007bff",
        textDecorationLine: "underline",
    },
    closeButton: {
        backgroundColor: "#28a745",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
