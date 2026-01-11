import { StatusBar } from "expo-status-bar";
import { useRevenueCat } from "./src/hooks/useRevenueCat";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
	// Initialize RevenueCat on app startup
	useRevenueCat({
		autoFetch: true,
	});

	return (
		<>
			<AppNavigator />
			<StatusBar style="auto" />
		</>
	);
}
