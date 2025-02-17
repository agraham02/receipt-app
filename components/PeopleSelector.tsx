// PeopleSelector.tsx
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

export interface Person {
    id: string;
    name: string;
}

interface PeopleSelectorProps {
    onPeopleChange?: (people: Person[]) => void;
}

const PeopleSelector: React.FC<PeopleSelectorProps> = ({ onPeopleChange }) => {
    const [name, setName] = useState("");
    const [people, setPeople] = useState<Person[]>([]);

    const addPerson = () => {
        if (name.trim() === "") return;
        const newPerson: Person = {
            id: Date.now().toString(),
            name: name.trim(),
        };
        const updatedPeople = [...people, newPerson];
        setPeople(updatedPeople);
        setName("");
        if (onPeopleChange) onPeopleChange(updatedPeople);
    };

    const removePerson = (id: string) => {
        const updatedPeople = people.filter((person) => person.id !== id);
        setPeople(updatedPeople);
        if (onPeopleChange) onPeopleChange(updatedPeople);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>People at the Table</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a name"
                    value={name}
                    onChangeText={setName}
                />
                <Button title="Add" onPress={addPerson} />
            </View>
            <FlatList
                data={people}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removePerson(item.id)}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default PeopleSelector;

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
