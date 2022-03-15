import * as React from "react";
import {
	Text,
	View,
	Image,
	StyleSheet,
	FlatList,
	Pressable,
} from "react-native";
import { Auth } from "aws-amplify";
import ChatRoomItem from "../components/ChatRoomItem/ChatRoomItem";

import chatRoomsData from "../assets/dummy-data/ChatRooms";

const chatroom1 = chatRoomsData[0];
const chatroom2 = chatRoomsData[1];

export default function TabOneScreen() {
	const logOut = () => {
		Auth.signOut();
	};

	return (
		<View style={styles.page}>
			<FlatList
				data={chatRoomsData}
				renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
				showsVerticalScrollIndicator={false}
			/>
			<Pressable
				onPress={logOut}
				style={{ backgroundColor: "red", height: 50, margin: 10,borderRadius: 50, alignItems:'center', justifyContent: 'center', }}
			>
				<Text>Logout</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: "white",
	},
});
