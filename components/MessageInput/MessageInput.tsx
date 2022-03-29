import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	Image,
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
import { Auth, Storage } from "aws-amplify";
import { ChatRoom } from "../../src/models";
import * as ImagePicker from "expo-image-picker";
import EmojiSelector from "react-native-emoji-selector";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Audio } from "expo-av";

export default function MessageInput({ chatRoom }) {
	const [message, setMessage] = useState("");
	const [isemojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [paused, setPaused] = useState(true)
	const [audioProgress, setAudioProgress] = useState(0)

	useEffect(() => {
		(async () => {
			if (Platform.OS !== "web") {
				const libraryResponse =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
				await Audio.requestPermissionsAsync();

				if (
					libraryResponse.status !== "granted" ||
					photoResponse.status !== "granted"
				) {
					alert(
						"Desculpe, precisamos de um rolo de câmera fazer isso funcionar !"
					);
				}
			}
		})();
	}, []);

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

		resetFields();
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
		if (image) {
			sendImage();
		} else if (message) {
			sendMessage();
		} else {
			onPlusClicked();
		}
	};

	const resetFields = () => {
		setMessage("");
		setIsEmojiPickerOpen(false);
		setImage(null);
		setProgress(0);
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.5,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	const takePhoto = async () => {
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			aspect: [4, 3],
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	const progressCallback = (progress) => {
		setProgress(progress.loaded / progress.total);
	};

	const sendImage = async () => {
		if (!image) {
			return;
		}

		const blob = await getImageBlob();
		const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
			progressCallback,
		});

		const user = await Auth.currentAuthenticatedUser();
		const newMessage = await DataStore.save(
			new Message({
				content: message,
				image: key,
				userID: user.attributes.sub,
				chatroomID: chatRoom.id,
			})
		);

		updateLastMessage(newMessage);
		resetFields();
	};

	const getImageBlob = async () => {
		if (!image) {
			return null;
		}

		const response = await fetch(image);
		const blob = await response.blob();
		return blob;
	};

	// Audio Recording
	async function startRecording() {
		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			console.log("Starting recording..");
			const { recording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			setRecording(recording);
			console.log("Recording started");
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		console.log("Stopping recording..");
		if (!recording) {
			return;
		}
		setRecording(null);
		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
		});
		const uri = recording.getURI();
		console.log("Recording stopped and stored at", uri);
		if (!uri) {
			return;
		}
		const { sound } = await Audio.Sound.createAsync({ uri });

		setSound(sound);
	}

	const playPauseSound = async () => {
		if(!sound) {
			return
		}
		if(paused) {
			setPaused(false)
			await sound?.playAsync()
		}else{
			setPaused(true)
			await sound?.pauseAsync()
		}

	}

	return (
		<KeyboardAvoidingView
			style={[styles.root, { height: isemojiPickerOpen ? "50%" : "auto" }]}
			behavior={Platform.OS == "ios" ? "padding" : "height"}
			keyboardVerticalOffset={100}
		>
			{image && (
				<View style={styles.sendImageContainer}>
					<Image
						source={{ uri: image }}
						style={{ width: 100, height: 100, borderRadius: 10 }}
					/>
					<View
						style={{
							flex: 1,
							justifyContent: "flex-start",
							alignSelf: "flex-end",
						}}
					>
						<View
							style={{
								height: 3,
								backgroundColor: "#3777f0",
								width: `${progress * 100}%`,
							}}
						></View>
					</View>

					<Pressable onPress={() => setImage(null)}>
						<AntDesign
							name="close"
							size={24}
							color="black"
							style={{ margin: 5 }}
						/>
					</Pressable>
				</View>
			)}

			{sound && (
				<View style={styles.sendAudioContainer}>
					<Pressable  onPress={playPauseSound}>
						<Feather 
						name={paused ? "play" : 'pause' }
						size={24} 
						color="grey" />
					</Pressable>

					<View style={styles.audioProgressBG}>
						<View style={[styles.audioProgressFG, {left: `${audioProgress * 100}%`}]}/>
					</View>
				</View>
			)}

			<View style={styles.row}>
				<View style={styles.inputContainer}>
					<Pressable
						onPress={() =>
							setIsEmojiPickerOpen((currentValue) => !currentValue)
						}
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

					<Pressable onPress={pickImage}>
						<Feather name="image" size={24} color="grey" style={styles.icon} />
					</Pressable>

					<Pressable onPress={takePhoto}>
						<Feather name="camera" size={24} color="grey" style={styles.icon} />
					</Pressable>

					<Pressable onPressIn={startRecording} onPressOut={stopRecording}>
						<MaterialCommunityIcons
							name={recording ? "microphone" : "microphone-outline"}
							size={24}
							color={recording ? "red" : "#595959"}
							style={styles.icon}
						/>
					</Pressable>
				</View>
				<Pressable onPress={onPress} style={styles.buttonContainer}>
					{message || image ? (
						<Ionicons name="send" size={18} color="white" />
					) : (
						<AntDesign name="plus" size={24} color="white" />
					)}
				</Pressable>
			</View>

			{isemojiPickerOpen && (
				<EmojiSelector
					onEmojiSelected={(emoji) =>
						setMessage((currentMessage) => currentMessage + emoji)
					}
					columns={9}
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
	sendImageContainer: {
		flexDirection: "row",
		marginVertical: 10,
		justifyContent: "space-between",
		alignSelf: "stretch",
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 10,
	},
	sendAudioContainer: {
		marginVertical: 10,
		padding: 10,
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems:'center',
		alignSelf: "stretch",
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 10,
	},
	audioProgressBG: {
		height: 3,
		flex:1,
		backgroundColor: 'lightgrey',
		borderRadius: 5,
		margin: 10,

	},
	audioProgressFG: {
		width: 10,
		height: 10,
		borderRadius: 10,
		backgroundColor:'#3777f0',

		position: 'absolute',
		top: -3,

	}
});
