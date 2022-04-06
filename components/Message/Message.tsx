import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Auth, DataStore, Storage } from "aws-amplify";
import { User } from "../../src/models";
import { S3Image } from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import { Ionicons } from "@expo/vector-icons";
import {Message as MessageModel} from '../../src/models'


const blue = "#3872e9";
const grey = "lightgrey";

export default function Message(props) {
	const [message, setMessage] = useState<MessageModel>(props.message)
	const [user, setUser] = useState<User | undefined>();
	const [isMe, setIsMe] = useState<boolean | null>(null);
	const [soundURI, setSoundURI] = useState<any>(null)

	const { width } = useWindowDimensions();

	useEffect(() => {
		DataStore.query(User, message.userID).then(setUser);
	}, []);

	useEffect(() => {
		const subscription = DataStore.observe(MessageModel, message.id).subscribe(msg => {
		  if(msg.model === MessageModel && msg.opType === 'UPDATE'){
			setMessage(message => ({...message, ...msg.element}))
		  }
		})
	
		return () => subscription.unsubscribe()
	  }, [])

	  useEffect(() => {
		setAsRead()
	}, [isMe, message]);
	  

	useEffect(() => {
	  if(message.audio) {
		  Storage.get(message.audio).then(setSoundURI)
	  }

	}, [message])
	

	useEffect(() => {
		const checkIfMe = async () => {
			if (!user) {
				return;
			}
			const authUser = await Auth.currentAuthenticatedUser();
			setIsMe(user.id === authUser.attributes.sub);
		};
		checkIfMe();
	}, [user]);

	const setAsRead = async () => {
		if( isMe === false && message.status !== 'READ') {
		await	DataStore.save(MessageModel.copyOf(message, (updated) => {updated.status = 'READ'}))
		}
	}

	if (!user) {
		return <ActivityIndicator />;
	}

	return (
		<View
			style={[
				styles.container,
				isMe ? styles.rightContainer : styles.leftContainer,
				{width: soundURI ? '75%' : 'auto'}
			]}
		>
			{message.image && (
				<View style={{ marginBottom: message.content ? 10 : 0 }}>
					<S3Image
						imgKey={message.image}
						style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
						resizeMode="contain"
					/>
				</View>
			)}

			{soundURI && <AudioPlayer soundURI={soundURI}/>}


			{!!message.content && (
				<Text style={[{ color: isMe ? "white"  : "black" }]}>
					{message.content}
				</Text>
			)}


			{isMe && !!message.status && message.status !== 'SENT' && (
					<Ionicons 
					name={message.status === 'DELIVERED' ? "checkmark" : "checkmark-done"} 
					size={16} color='white' 
					style={{marginHorizontal:5}}
					/>
				  )}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		margin: 10,
		borderRadius: 10,
		maxWidth: "75%",
		flexDirection:'row',
		alignItems:'flex-end'
	},
	text: {
		color: "white",
	},
	leftContainer: {
		backgroundColor: grey, 
		marginLeft: 10,
		marginRight: "auto",
	},
	rightContainer: {
		backgroundColor: blue,
		marginLeft: "auto",
		marginRight: 10,
	},
});
