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
    // Initialize the mapping: personID -> amount owed (only for the ordered items)
    const splits: { [personId: string]: number } = {};
    people.forEach((person) => {
        splits[person.id] = 0;
    });

    // Sum of all item prices (only if assigned)
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

    // Initialize totalTip
    let totalTip = 0;
    // If gratuity is NOT already included, add extra tip proportionally
    if (!tipIncluded && tipPercentage > 0) {
        totalTip = totalWithoutTip * tipPercentage;
        // Distribute the tip proportionally based on each person's subtotal
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

    // Local state for tipping options
    const [tipIncluded, setTipIncluded] = useState<boolean>(false);
    const [tipPercentage, setTipPercentage] = useState<string>("0"); // stored as string for TextInput

    // Convert tip percentage to decimal (e.g., 15 -> 0.15)
    const tipPercentDecimal = parseFloat(tipPercentage) / 100 || 0;

    // Calculate splits and totals using useMemo for optimization
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

    // Prepare summary data for each person
    const summaryData = people.map((person) => ({
        id: person.id,
        name: person.name,
        amount: splits[person.id] || 0,
    }));

    // Calculate overall total (should equal totalWithoutTip + totalTip)
    const overallTotal = summaryData.reduce(
        (sum, person) => sum + person.amount,
        0
    );

    // Define your payment options
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

    const handleFinalize = async () => {
        const summaryText =
            summaryData
                .map((person) => `${person.name}: $${person.amount.toFixed(2)}`)
                .join("\n") +
            `\n\nTip: $${totalTip.toFixed(2)}\nTotal: $${overallTotal.toFixed(
                2
            )}`;

        try {
            const result = await Share.share({
                message: `Final Bill Summary:\n${summaryText}`,
            });
            if (result.action === Share.sharedAction) {
                // Optionally open the payment options modal after sharing
                // setModalVisible(true);
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
