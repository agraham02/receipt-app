// SplitSummaryScreen.tsx
import React, { useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useSearchParams, useRouter } from "expo-router";

export interface Person {
    id: string;
    name: string;
}

export interface ReceiptItem {
    id: string;
    name: string;
    price: number;
}

export interface ItemAssignment {
    [itemId: string]: string[];
}

// Helper function to calculate each person’s share
const calculateSplits = (
    items: ReceiptItem[],
    people: Person[],
    assignments: ItemAssignment
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
    // Retrieve route params
    const {
        items: itemsParam,
        people: peopleParam,
        assignments: assignmentsParam,
    } = useSearchParams<{
        items: string;
        people: string;
        assignments: string;
    }>();

    // Parse the parameters (or you could use context/state)
    const items: ReceiptItem[] = JSON.parse(itemsParam || "[]");
    const people: Person[] = JSON.parse(peopleParam || "[]");
    const assignments: ItemAssignment = JSON.parse(assignmentsParam || "{}");

    // Calculate the splits using useMemo for optimization
    const splits = useMemo(
        () => calculateSplits(items, people, assignments),
        [items, people, assignments]
    );

    const router = useRouter();

    // Create a summary list from splits mapping
    const summaryData = people.map((person) => ({
        id: person.id,
        name: person.name,
        amount: splits[person.id] || 0,
    }));

    const handleFinalize = () => {
        // For demonstration, just show an alert with the summary data.
        let summaryText = summaryData
            .map((person) => `${person.name}: $${person.amount.toFixed(2)}`)
            .join("\n");
        Alert.alert("Final Bill Summary", summaryText, [
            { text: "OK", onPress: () => router.push("/confirmation") },
        ]);
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
