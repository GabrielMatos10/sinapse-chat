import React, {useState, useEffect} from "react";
import { Text, View, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "@aws-amplify/datastore";
import { ChatRoomUser, User } from "../../src/models";
import styles from './styles'


export default function ({ chatRoom }) {
	const [users, setUsers] = useState<User[]>([]) // all users in this chatroom
	const [user, setUser] = useState<User | null>(null)

	const navigation = useNavigation()

	const onPress = () => {
		navigation.navigate('ChatRoom', {id: chatRoom.id})
	}

	if (!user) {
		return <ActivityIndicator/>
	}

	return (
		<Pressable onPress={onPress} style={styles.container}>
			<Image
				style={styles.image}
				source={{
					uri: user.imageUri
				}}
			/>

			{chatRoom.newMessages && <View style={styles.badgeContainer}>
				<Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
			</View> }

			<View style={styles.rightContainer}>
				<View style={styles.row}>
					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
				</View>
				<Text numberOfLines={1} style={styles.text}>
					{chatRoom.lastMessage.content}
				</Text>
			</View>
		</Pressable>
	);
}


