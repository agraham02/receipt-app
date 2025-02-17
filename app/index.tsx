import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Items from "@/components/Items";
import PeopleSelector from "@/components/PeopleSelector";
import ItemAssignmentScreen from "./item-assignment";
import SplitSummaryScreen from "./split-summary";

export default function Index() {
    return (
        <View style={styles.container}>
            {/* <PeopleSelector /> */}
            {/* <ItemAssignmentScreen /> */}
            <SplitSummaryScreen />
            {/* <Items /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
