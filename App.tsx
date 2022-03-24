import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { withAuthenticator } from "aws-amplify-react-native";

import AmplifyClass, {Auth} from "aws-amplify";
import awsmobile from "./src/aws-exports";

AmplifyClass.configure(awsmobile);

function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	Auth.currentAuthenticatedUser()

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


export default withAuthenticator(App)