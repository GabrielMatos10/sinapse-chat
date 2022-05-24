import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import styles from './styles'


export default function UserItem ({user, onPress, isSelected }) {

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
			{isSelected !== undefined && (<Feather 
			name={isSelected ? 'check-circle' : 'circle'}
			size={20} 
			color="black" 
			/>)}
		</Pressable>
	);
}


