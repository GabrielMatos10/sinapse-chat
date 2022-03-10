import React from 'react'
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import Message from '../components/Message'
import MessageInput from '../components/MessageInput'
import chatRoomData from '../assets/dummy-data/Chats'

export default function ChatRoomScreen() {
  const route = useRoute()
  const navigation = useNavigation()

  console.warn("Displaying chato room : ", route.params?.id)

  navigation.setOptions({title: 'ElonMusk'})

  return (
    <SafeAreaView style={styles.page}>
      <FlatList 
        data={chatRoomData.messages}
        renderItem={({item}) => <Message message={item}/>}
        inverted
      />
      <MessageInput/>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  page: {
      flex:1,
      backgroundColor: 'white'
  }
})