// ItemsScreen.tsx
import { useReceipt, ReceiptItem } from "@/context/ReceiptContext";
import React, { useState, useEffect, useMemo } from "react";
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

    // Compute the subtotal from items whenever they change
    const computedSubtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price, 0);
    }, [items]);

    // Editable fields (stored as strings for TextInput)
    const [subtotal, setSubtotal] = useState<string>(
        computedSubtotal.toFixed(2)
    );
    const [tip, setTip] = useState<string>("0");
    const [tax, setTax] = useState<string>("0");

    // Update the subtotal field whenever the computed subtotal changes.
    useEffect(() => {
        setSubtotal(computedSubtotal.toFixed(2));
    }, [computedSubtotal]);

    // Compute total dynamically; fallback to 0 if invalid.
    const total =
        (parseFloat(subtotal) || 0) +
        (parseFloat(tip) || 0) +
        (parseFloat(tax) || 0);

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
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Subtotal:</Text>
                    <TextInput
                        style={styles.fieldInput}
                        value={subtotal}
                        onChangeText={setSubtotal}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Tip:</Text>
                    <TextInput
                        style={styles.fieldInput}
                        value={tip}
                        onChangeText={setTip}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                </View>
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
                <View style={[styles.fieldRow, styles.totalRow]}>
                    <Text style={styles.fieldLabel}>Total:</Text>
                    <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save & Continue</Text>
            </TouchableOpacity>
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
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    fieldRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 18,
        fontWeight: "bold",
    },
    fieldInput: {
        width: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 4,
        textAlign: "right",
        fontSize: 18,
    },
    totalRow: {
        borderTopWidth: 2,
        borderTopColor: "#ccc",
        paddingTop: 12,
        marginTop: 8,
    },
    totalText: {
        fontSize: 18,
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
