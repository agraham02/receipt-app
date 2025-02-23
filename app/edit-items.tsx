import { View, Text } from "react-native";
import React from "react";
import ItemEditor from "@/components/ItemEditor";
import { Link } from "expo-router";
import Button from "@/components/Button";

export default function EditItems() {
    return (
        <View style={{ flex: 1 }}>
            <ItemEditor />
            {/* <Link href="/edit-people">Next</Link> */}
            <Button label="Save & Continue" href="/edit-people"/>
        </View>
    );
}
