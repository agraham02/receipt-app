import { View, Text } from "react-native";
import React from "react";
import PeopleEditor from "@/components/PeopleEditor";
import { Link } from "expo-router";
import Button from "@/components/Button";

export default function EditPeople() {
    return (
        <View style={{ flex: 1 }}>
            <PeopleEditor />
            <Button label="Next" href="/item-assignment" />
        </View>
    );
}
