// SplitSummaryScreen.tsx
import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Share,
    Switch,
    TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
    Assignment,
    Person,
    ReceiptItem,
    useReceipt,
} from "@/context/ReceiptContext";
import PaymentModal from "@/components/PaymentModal";

// Updated helper function that returns splits along with totals
const calculateSplits = (
    items: ReceiptItem[],
    people: Person[],
    assignments: Assignment,
    tipPercentage: number, // e.g., 0.15 for 15%
    tipIncluded: boolean // if gratuity is already included, no extra tip is applied
) => {
    // Initialize mapping: personID -> amount owed (for ordered items only)
    const splits: { [personId: string]: number } = {};
    people.forEach((person) => {
        splits[person.id] = 0;
    });

    // Sum the prices of all items (only if assigned)
    let totalWithoutTip = 0;
    items.forEach((item) => {
        const assigned = assignments[item.id] || [];
        if (assigned.length > 0) {
            totalWithoutTip += item.price;
            const share = item.price / assigned.length;
            assigned.forEach((personId) => {
                splits[personId] += share;
            });
        }
    });

    // Calculate and distribute tip if gratuity is not already included
    let totalTip = 0;
    if (!tipIncluded && tipPercentage > 0) {
        totalTip = totalWithoutTip * tipPercentage;
        const totalAssigned = Object.values(splits).reduce((a, b) => a + b, 0);
        people.forEach((person) => {
            const personShare = splits[person.id];
            if (personShare > 0 && totalAssigned > 0) {
                const tipContribution =
                    (personShare / totalAssigned) * totalTip;
                splits[person.id] += tipContribution;
            }
        });
    }

    return { splits, totalWithoutTip, totalTip };
};

const SplitSummaryScreen: React.FC = () => {
    const router = useRouter();
    const { people, items, assignments } = useReceipt();
    const [modalVisible, setModalVisible] = useState(false);
    const [tipIncluded, setTipIncluded] = useState<boolean>(false);
    const [tipPercentage, setTipPercentage] = useState<string>("0"); // as string for TextInput

    // Convert tip percentage (e.g., "15") to decimal (0.15)
    const tipPercentDecimal = parseFloat(tipPercentage) / 100 || 0;

    // Calculate splits and totals using useMemo for efficiency
    const { splits, totalWithoutTip, totalTip } = useMemo(
        () =>
            calculateSplits(
                items,
                people,
                assignments,
                tipPercentDecimal,
                tipIncluded
            ),
        [items, people, assignments, tipPercentDecimal, tipIncluded]
    );

    // Prepare summary data per person, including a breakdown of their items
    const summaryData = people.map((person) => {
        // For each item, if the person is assigned, compute their share and extra info
        const breakdown = items
            .filter((item) => (assignments[item.id] || []).includes(person.id))
            .map((item) => {
                const assignedCount = (assignments[item.id] || []).length;
                const sharePrice = item.price / assignedCount;
                // List the names of all persons sharing this item (optional)
                const sharedWith = people
                    .filter((p) => (assignments[item.id] || []).includes(p.id))
                    .map((p) => p.name);
                return {
                    id: item.id,
                    name: item.name,
                    fullPrice: item.price,
                    sharePrice,
                    assignedCount,
                    sharedWith,
                };
            });
        return {
            id: person.id,
            name: person.name,
            amount: splits[person.id] || 0,
            breakdown,
        };
    });

    // Overall total (should equal subtotal + tip)
    const overallTotal = summaryData.reduce(
        (sum, person) => sum + person.amount,
        0
    );

    const paymentOptions = [
        {
            id: "1",
            label: "Venmo QR Code",
            type: "qr",
            // image: require("@/assets/venmo_qr.png"), // Replace with your actual QR code image
        },
        {
            id: "2",
            label: "PayPal",
            type: "handle",
            value: "paypal.me/yourhandle",
        },
        {
            id: "3",
            label: "Cash App",
            type: "handle",
            value: "$YourCashApp",
        },
        {
            id: "4",
            label: "Link",
            type: "link",
            value: "https://yourpaymentlink.com",
        },
    ];

    // Finalize & Share using React Native's Share API
    const handleFinalize = async () => {
        const summaryText =
            summaryData
                .map((person) => {
                    const itemsText = person.breakdown
                        .map(
                            (item) =>
                                `${item.name}: full $${item.fullPrice.toFixed(
                                    2
                                )}, your share $${item.sharePrice.toFixed(2)}`
                        )
                        .join("\n    ");
                    return `${person.name}: $${person.amount.toFixed(
                        2
                    )}\n    ${itemsText}`;
                })
                .join("\n\n") +
            `\n\nSubtotal: $${totalWithoutTip.toFixed(
                2
            )}\nTip: $${totalTip.toFixed(2)}\nTotal: $${overallTotal.toFixed(
                2
            )}`;

        try {
            const result = await Share.share({
                message: `Final Bill Summary:\n\n${summaryText}`,
            });
            if (result.action === Share.sharedAction) {
                // Optionally, open payment modal or navigate to confirmation
                setModalVisible(true);
            } else if (result.action === Share.dismissedAction) {
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

            {/* Tipping Options */}
            <View style={styles.tipContainer}>
                <Text style={styles.tipLabel}>
                    Is gratuity already included?
                </Text>
                <Switch value={tipIncluded} onValueChange={setTipIncluded} />
            </View>
            {!tipIncluded && (
                <View style={styles.tipInputContainer}>
                    <Text style={styles.tipLabel}>Add Tip (%):</Text>
                    <TextInput
                        style={styles.tipInput}
                        keyboardType="numeric"
                        value={tipPercentage}
                        onChangeText={setTipPercentage}
                        placeholder="e.g., 15"
                    />
                </View>
            )}

            {/* List of Persons with Breakdown */}
            <FlatList
                data={summaryData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.personContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.personName}>{item.name}</Text>
                            <Text style={styles.personAmount}>
                                ${item.amount.toFixed(2)}
                            </Text>
                        </View>
                        {item.breakdown.length > 0 && (
                            <View style={styles.breakdownContainer}>
                                {item.breakdown.map((bd) => (
                                    <View
                                        key={bd.id}
                                        style={styles.breakdownRow}
                                    >
                                        <Text style={styles.breakdownItem}>
                                            {bd.name}
                                        </Text>
                                        <Text style={styles.breakdownDetail}>
                                            Full: ${bd.fullPrice.toFixed(2)},
                                            Your Share: $
                                            {bd.sharePrice.toFixed(2)}
                                            {bd.assignedCount > 1 &&
                                                ` (Shared with: ${bd.sharedWith.join(
                                                    ", "
                                                )})`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalAmount}>
                                ${totalWithoutTip.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tip</Text>
                            <Text style={styles.totalAmount}>
                                ${totalTip.toFixed(2)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.totalRow,
                                {
                                    borderTopWidth: 2,
                                    borderTopColor: "#ccc",
                                    marginTop: 8,
                                },
                            ]}
                        >
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>
                                ${overallTotal.toFixed(2)}
                            </Text>
                        </View>
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
                paymentOptions={paymentOptions}
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
    tipContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    tipLabel: {
        fontSize: 16,
    },
    tipInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    tipInput: {
        width: 60,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 4,
        textAlign: "center",
    },
    personContainer: {
        marginBottom: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    personName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    personAmount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    breakdownContainer: {
        marginTop: 8,
        marginLeft: 16,
    },
    breakdownRow: {
        marginBottom: 4,
    },
    breakdownItem: {
        fontSize: 16,
        fontWeight: "600",
    },
    breakdownDetail: {
        fontSize: 14,
        color: "#555",
    },
    footerContainer: {
        marginTop: 16,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 20,
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
