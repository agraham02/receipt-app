// ItemsScreen.tsx
import { useReceipt, ReceiptItem } from "@/context/ReceiptContext";
import React, { useState } from "react";
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
});
