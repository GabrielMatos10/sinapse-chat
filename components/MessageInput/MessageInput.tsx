import React, { useState, useEffect } from "react";

import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import {
	SimpleLineIcons,
	Feather,
	MaterialCommunityIcons,
	AntDesign,
	Ionicons,
} from "@expo/vector-icons";
import { DataStore } from "@aws-amplify/datastore";
import { Message } from "../../src/models";
import { User } from "../../src/models";
import { Auth } from "aws-amplify";
import { ChatRoom } from "../../src/models";
import EmojiSelector from "react-native-emoji-selector";

export default function MessageInput({ chatRoom }) {
	const [message, setMessage] = useState("");
    const [isemojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

	const sendMessage = async () => {
		// send message

		const user = await Auth.currentAuthenticatedUser();
		const newMessage = await DataStore.save(
			new Message({
				content: message,
				userID: user.attributes.sub,
				chatroomID: chatRoom.id,
			})
		);

		updateLastMessage(newMessage);

		setMessage("");
        setIsEmojiPickerOpen(false)
	};

	const updateLastMessage = async (newMessage) => {
		DataStore.save(
			ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
				updatedChatRoom.LastMessage = newMessage;
			})
		);
	};

	const onPlusClicked = () => {};

	const onPress = () => {
		if (message) {
			sendMessage();
		} else {
			onPlusClicked();
		}
	};

	return (
		<KeyboardAvoidingView
			style={[styles.root, {height: isemojiPickerOpen ? "50%" : "auto"}]}
			behavior={Platform.OS == "ios" ? "padding" : "height"}
			keyboardVerticalOffset={100}
		>
			<View style={styles.row}>
				<View style={styles.inputContainer}>
                    <Pressable
                    onPress={() => setIsEmojiPickerOpen((currentValue) => !currentValue)}
                    >

					<SimpleLineIcons
						name="emotsmile"
						size={24}
						color="#595959"
						style={styles.icon}
					/>
                    </Pressable>

					<TextInput
						style={styles.input}
						value={message}
						onChangeText={setMessage}
						placeholder="Digite sua mensagem..."
					/>

					<Feather name="camera" size={24} color="grey" style={styles.icon} />
					<MaterialCommunityIcons
						name="microphone-outline"
						size={24}
						color="grey"
						style={styles.icon}
					/>
				</View>
				<Pressable onPress={onPress} style={styles.buttonContainer}>
					{message ? (
						<Ionicons name="send" size={18} color="white" />
					) : (
						<AntDesign name="plus" size={24} color="white" />
					)}
				</Pressable>
			</View>

			{isemojiPickerOpen && (
            <EmojiSelector
            
            onEmojiSelected={(emoji) => setMessage(currentMessage => currentMessage + emoji)} 
            columns= {9}
            /> 
            )}
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	root: {
		padding: 10,
	},
    row: {
		flexDirection: "row",

    },
	inputContainer: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		marginRight: 10,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "#dedede",
		alignItems: "center",
		flexDirection: "row",
		padding: 5,
	},
	input: {
		flex: 1,
		marginHorizontal: 5,
	},
	icon: {
		marginHorizontal: 5,
	},
	buttonContainer: {
		width: 40,
		height: 40,
		backgroundColor: "#3872e9",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 35,
	},
});
