import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import styles from './styles'
import React from "react";


export default function ({chatRoom}) {
    const user = chatRoom.users[1]


	const onPress = () => {
		console.warn('pressed')
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


