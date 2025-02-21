// ItemAssignmentScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { ReceiptItem, useReceipt } from "@/context/ReceiptContext";

// This type maps each receipt item to an array of person IDs who had that item.
export interface ItemAssignment {
    [itemId: string]: string[];
}

const ItemAssignmentScreen: React.FC = () => {
    // Assume the previous screen passed items and people via route parameters.
    // You might need to JSON.parse if they were passed as JSON strings.
    // const { items: itemsParam, people: peopleParam } = useSearchParams<{
    //     items: string;
    //     people: string;
    // }>();
    // const items: ReceiptItem[] = JSON.parse(itemsParam || "[]");
    // const people: Person[] = JSON.parse(peopleParam || "[]");

    const {items, people, assignments, setAssignments} = useReceipt();

    // Initialize assignments with an empty array for each item on component mount.
    useEffect(() => {
        const initialAssignments: ItemAssignment = {};
        items.forEach((item) => {
            initialAssignments[item.id] = [];
        });
        setAssignments(initialAssignments);
    }, [items]);

    // Toggle assignment: add or remove a person for a given receipt item.
    const toggleAssignment = (itemId: string, personId: string) => {
        setAssignments((prev) => {
            const current = prev[itemId] || [];
            if (current.includes(personId)) {
                // Remove personId
                return {
                    ...prev,
                    [itemId]: current.filter((id) => id !== personId),
                };
            } else {
                // Add personId
                return { ...prev, [itemId]: [...current, personId] };
            }
        });
    };

    const renderItem = ({ item }: { item: ReceiptItem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>
                {item.name} - ${item.price.toFixed(2)}
            </Text>
            <View style={styles.peopleContainer}>
                {people.map((person) => {
                    const isSelected = assignments[item.id]?.includes(
                        person.id
                    );
                    return (
                        <TouchableOpacity
                            key={person.id}
                            style={[
                                styles.personButton,
                                isSelected && styles.personButtonSelected,
                            ]}
                            onPress={() => toggleAssignment(item.id, person.id)}
                        >
                            <Text
                                style={[
                                    styles.personText,
                                    isSelected && styles.personTextSelected,
                                ]}
                            >
                                {person.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const handleNext = () => {
        // Here you can proceed to the next step (like split calculation)
        // For example, navigate to a summary screen and pass the assignments.
        // router.push({
        //     pathname: "/split-summary",
        //     params: {
        //         items: JSON.stringify(items),
        //         people: JSON.stringify(people),
        //         assignments: JSON.stringify(assignments),
        //     },
        // });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Assign Items to People</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            <Link href="/split-summary">next</Link>
        </View>
    );
};

export default ItemAssignmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    itemContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    peopleContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    personButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    personButtonSelected: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    personText: {
        color: "#000",
    },
    personTextSelected: {
        color: "#fff",
    },
    nextButton: {
        backgroundColor: "#28a745",
        padding: 12,
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
