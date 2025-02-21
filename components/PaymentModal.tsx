// PaymentModal.tsx
import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    // You can pass additional props for payment options if needed.
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose }) => {
    // Replace these with your actual payment details.
    const qrCodeImage = require("./assets/qr-code.png"); // Replace with your QR code image path
    const paymentHandle = "@YourPaymentHandle";

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Payment Options</Text>
                    <View style={styles.paymentOption}>
                        <Text style={styles.optionLabel}>Scan to Pay:</Text>
                        <Image
                            source={qrCodeImage}
                            style={styles.qrCode}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.paymentOption}>
                        <Text style={styles.optionLabel}>Pay via Handle:</Text>
                        <Text style={styles.handleText}>{paymentHandle}</Text>
                    </View>
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
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    paymentOption: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    optionLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    qrCode: {
        width: 150,
        height: 150,
    },
    handleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007bff",
    },
    closeButton: {
        backgroundColor: "#28a745",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
