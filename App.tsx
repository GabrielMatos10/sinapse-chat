import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { withAuthenticator } from "aws-amplify-react-native";

import AmplifyClass, { Auth, DataStore, Hub } from "aws-amplify";
import awsmobile from "./src/aws-exports";
import { Message } from "./src/models";

AmplifyClass.configure(awsmobile);

function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	Auth.currentAuthenticatedUser();

	useEffect(() => {
		// Create listener
		const listener = Hub.listen("datastore", async (hubData) => {
			const { event, data } = hubData.payload;
			if (event === 'outboxMutationProcessed' 
			&& data.model === Message 
			&& !(['DELIVERED', 'READ'].includes(data.element.status ))) {
					// set to delivered
					DataStore.save(
						Message.copyOf(data.element, (updated) => {
							updated.status = "DELIVERED";
						})
					)
			}
		});

		// Remove listener
		return () => listener();
	}, []);

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<Navigation colorScheme={colorScheme} />
			</SafeAreaProvider>
		);
	}
}

export default withAuthenticator(App);
