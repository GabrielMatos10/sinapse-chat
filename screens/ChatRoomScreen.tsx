import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import React from 'react'
import Message from '../components/Message'
import MessageInput from '../components/MessageInput'
import chatRoomData from '../assets/dummy-data/Chats'

export default function ChatRoomScreen() {
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