// ItemsScreen.tsx
import { useReceipt, ReceiptItem } from "@/context/ReceiptContext";
import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const ItemEditor: React.FC = () => {
    const { items, setItems } = useReceipt();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    // Compute the subtotal from items whenever they change (as a number)
    const computedSubtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price, 0);
    }, [items]);

    // Editable fields for tip and tax (stored as strings for TextInput)
    const [tip, setTip] = useState<string>("0");
    const [tax, setTax] = useState<string>("0");

    // New state for tip mode: "percentage" or "fixed"
    const [tipMode, setTipMode] = useState<"percentage" | "fixed">(
        "percentage"
    );

    // Compute the tip based on the selected mode using computedSubtotal directly
    const computedTip = useMemo(() => {
        const sub = computedSubtotal;
        const tipInput = parseFloat(tip) || 0;
        if (tipMode === "percentage") {
            return sub * (tipInput / 100);
        } else {
            return tipInput;
        }
    }, [computedSubtotal, tip, tipMode]);

    // Compute tax as a number (fallback to 0 if invalid)
    const computedTax = parseFloat(tax) || 0;

    // Compute total as the sum of computedSubtotal, computedTip, and computedTax
    const total = computedSubtotal + computedTip + computedTax;

    const addItem = () => {
        if (!name.trim() || !price.trim() || isNaN(Number(price))) return;
        const newItem: ReceiptItem = {
            id: Date.now().toString(),
            name: name.trim(),
            price: Number(price),
        };
        setItems([...items, newItem]);
        setName("");
        setPrice("");
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Receipt Items</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Item name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <Button title="Add" onPress={addItem} />
            </View>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>
                            {item.name} - ${item.price.toFixed(2)}
                        </Text>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.summaryContainer}>
                {/* Display computed subtotal as read-only text */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Subtotal:</Text>
                    <Text style={styles.fieldValue}>
                        ${computedSubtotal.toFixed(2)}
                    </Text>
                </View>

                {/* Tip Mode Selection */}
                <View style={styles.tipModeContainer}>
                    <Text style={styles.fieldLabel}>Tip Mode:</Text>
                    <View style={styles.tipModeButtons}>
                        <TouchableOpacity
                            style={[
                                styles.tipModeButton,
                                tipMode === "percentage" &&
                                    styles.tipModeButtonSelected,
                            ]}
                            onPress={() => setTipMode("percentage")}
                        >
                            <Text
                                style={[
                                    styles.tipModeText,
                                    tipMode === "percentage" &&
                                        styles.tipModeTextSelected,
                                ]}
                            >
                                Percentage
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tipModeButton,
                                tipMode === "fixed" &&
                                    styles.tipModeButtonSelected,
                            ]}
                            onPress={() => setTipMode("fixed")}
                        >
                            <Text
                                style={[
                                    styles.tipModeText,
                                    tipMode === "fixed" &&
                                        styles.tipModeTextSelected,
                                ]}
                            >
                                Fixed
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Editable Tip Input */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Tip:</Text>
                    <TextInput
                        style={styles.fieldInput}
                        value={tip}
                        onChangeText={setTip}
                        keyboardType="numeric"
                        placeholder={tipMode === "percentage" ? "%" : "$"}
                    />
                </View>

                {/* Editable Tax Input */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Tax:</Text>
                    <TextInput
                        style={styles.fieldInput}
                        value={tax}
                        onChangeText={setTax}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                </View>

                {/* Display Total */}
                <View style={[styles.fieldRow, styles.totalRow]}>
                    <Text style={styles.fieldLabel}>Total:</Text>
                    <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                </View>

                {/* Display Computed Tip */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Computed Tip:</Text>
                    <Text style={styles.totalText}>
                        ${computedTip.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ItemEditor;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginRight: 8,
        borderRadius: 4,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 16,
    },
    removeText: {
        color: "red",
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: "#f9f9f9",
        // borderTopWidth: 1,
        // borderTopColor: "#ccc",
        borderRadius: 10,
        // marginTop: 16,
    },
    fieldRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    fieldLabel: {
        // fontSize: 18,
        fontWeight: "bold",
    },
    fieldInput: {
        width: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        textAlign: "right",
        // fontSize: 18,
    },
    totalRow: {
        borderTopWidth: 2,
        borderTopColor: "#ccc",
        paddingTop: 12,
        marginTop: 8,
    },
    totalText: {
        // fontSize: 18,
        fontWeight: "bold",
    },
    tipModeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    tipModeButtons: {
        flexDirection: "row",
    },
    tipModeButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#28a745",
        borderRadius: 4,
        marginLeft: 8,
    },
    tipModeButtonSelected: {
        backgroundColor: "#28a745",
    },
    tipModeText: {
        // fontSize: 16,
        color: "#28a745",
    },
    tipModeTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    saveButton: {
        backgroundColor: "#28a745",
        marginHorizontal: 16,
        marginVertical: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
