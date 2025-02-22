// SplitSummaryScreen.tsx
import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Share,
} from "react-native";
import { useRouter } from "expo-router";
import {
    Assignment,
    Person,
    ReceiptItem,
    useReceipt,
} from "@/context/ReceiptContext";
import PaymentModal from "@/components/PaymentModal";

// Helper function to calculate each person’s share
const calculateSplits = (
    items: ReceiptItem[],
    people: Person[],
    assignments: Assignment
) => {
    // Initialize the mapping: personID -> amount owed
    const splits: { [personId: string]: number } = {};
    people.forEach((person) => {
        splits[person.id] = 0;
    });

    // For each item, split the price among assigned persons
    items.forEach((item) => {
        const assigned = assignments[item.id] || [];
        if (assigned.length > 0) {
            const share = item.price / assigned.length;
            assigned.forEach((personId) => {
                splits[personId] += share;
            });
        }
    });

    return splits;
};

const SplitSummaryScreen: React.FC = () => {
    const router = useRouter();
    // Get data from the shared ReceiptContext
    const { people, items, assignments } = useReceipt();
    const [modalVisible, setModalVisible] = useState(false);

    // Calculate the splits using useMemo for optimization
    const splits = useMemo(
        () => calculateSplits(items, people, assignments),
        [items, people, assignments]
    );

    // Create a summary list from splits mapping
    const summaryData = people.map((person) => ({
        id: person.id,
        name: person.name,
        amount: splits[person.id] || 0,
    }));

    // Finalize & Share using React Native's Share API
    const handleFinalize = async () => {
        const summaryText = summaryData
            .map((person) => `${person.name}: $${person.amount.toFixed(2)}`)
            .join("\n");

        try {
            const result = await Share.share({
                message: `Final Bill Summary:\n${summaryText}`,
            });
            if (result.action === Share.sharedAction) {
                // Optionally navigate to a confirmation screen after sharing
                // router.push("/confirmation");
            } else if (result.action === Share.dismissedAction) {
                // Dismissed the share dialog
                console.log("Share dismissed");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    const showPaymentModal = () => {
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Final Bill Summary</Text>
            <FlatList
                data={summaryData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.summaryRow}>
                        <Text style={styles.personName}>{item.name}</Text>
                        <Text style={styles.personAmount}>
                            ${item.amount.toFixed(2)}
                        </Text>
                    </View>
                )}
            />
            <TouchableOpacity
                style={styles.finalizeButton}
                onPress={handleFinalize}
            >
                <Text style={styles.finalizeButtonText}>Finalize & Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.finalizeButton}
                onPress={showPaymentModal}
            >
                <Text style={styles.finalizeButtonText}>
                    Show Payment Options
                </Text>
            </TouchableOpacity>
            <PaymentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

export default SplitSummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    personName: {
        fontSize: 18,
    },
    personAmount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    finalizeButton: {
        backgroundColor: "#28a745",
        padding: 16,
        alignItems: "center",
        borderRadius: 8,
        marginTop: 24,
    },
    finalizeButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
