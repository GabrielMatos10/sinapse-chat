import React, { useState, useEffect} from "react";
import {
	View,
	StyleSheet,
	FlatList,
} from "react-native";
import UserItem from "../components/UsersItem/UserItem";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../src/models";


import Users from "../assets/dummy-data/Users";


export default function UsersScreen() {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		DataStore.query(User).then(setUsers)
	},[])

	// useEffect(() => {
	//   // query users
	//   const fetchUsers = async () => {
	// 	  const fetchedUsers = await DataStore.query(User)
	// 	  setUsers(fetchedUsers)
	//   }
	//   fetchUsers()
	// }, [])
	


	return (
		<View style={styles.page}>
			<FlatList
				data={users}
				renderItem={({ item }) => <UserItem user={item} />}
				showsVerticalScrollIndicator={false}
			/>

		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: "white",
	},
});
