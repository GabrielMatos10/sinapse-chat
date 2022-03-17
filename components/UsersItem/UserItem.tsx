import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from './styles'
import { ChatRoom, ChatRoomUser, User } from "../../src/models";
import  { Auth, DataStore } from 'aws-amplify';

export default function UserItem ({user}) {

	const navigation = useNavigation()

	const onPress = async () => {

		// TODO if there is already a chat room between these 2 users
		// then redirect to the existing chat room
		// otherwise, create a new chatroom with these users.

		 




		// Create a chat room
		const newChatRoom = await DataStore.save(new ChatRoom({newMessages: 0}))

		// Connect auth user with the chat room
		const authUser = await Auth.currentAuthenticatedUser()
		console.log(authUser.attributes.sub)
		const dbUser = await DataStore.query(User, authUser.attributes.sub)
		console.log(dbUser)
		  await DataStore.save(new ChatRoomUser({
		  	user: dbUser,
		  	chatRoom: newChatRoom,
		  }))

		// connect clicked user with the chat room
		   await DataStore.save(new ChatRoomUser({
		   	user,
			chatRoom: newChatRoom
		   }))

		  navigation.navigate('ChatRoom', {id: newChatRoom.id})
	}

	return (
		<Pressable onPress={onPress} style={styles.container}>
			<Image
				style={styles.image}
				source={{
					uri: user.imageUri
				}}
			/>
			<View style={styles.rightContainer}>
				<View style={styles.row}>
					<Text style={styles.name}>{user.name}</Text>
				</View>
			</View>
		</Pressable>
	);
}


