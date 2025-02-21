import { View, Text } from 'react-native'
import React from 'react'
import PeopleEditor from '@/components/PeopleEditor'
import { Link } from 'expo-router'

export default function EditPeople() {
  return (
      <View style={{ flex: 1 }}>
          <PeopleEditor />
          <Link href="/item-assignment">next</Link>
      </View>
  );
}