import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View style={styles.container}>
            {/* <PeopleSelector /> */}
            {/* <ItemAssignmentScreen /> */}
            {/* <SplitSummaryScreen /> */}
            {/* <PeopleEditor /> */}
            {/* <Items /> */}
            <Text>New Session</Text>
            <Link href="/edit-items">edit items</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
