import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaywallScreen } from "@/screens/subscription/PaywallScreen";

// Placeholder screens (to be implemented)
const HomeScreen = () => null;
const DecoderScreen = () => null;
const CoachScreen = () => null;
const ProfileScreen = () => null;

export type RootStackParamList = {
	MainTabs: undefined;
	Paywall: undefined;
};

export type MainTabsParamList = {
	Home: undefined;
	Decoder: undefined;
	Coach: undefined;
	Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#f43f5e",
				tabBarInactiveTintColor: "#9ca3af",
				tabBarStyle: {
					borderTopWidth: 1,
					borderTopColor: "#e5e7eb",
					paddingTop: 8,
					paddingBottom: 8,
					height: 60,
				},
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: () => null, // TODO: Add icons
				}}
			/>
			<Tab.Screen
				name="Decoder"
				component={DecoderScreen}
				options={{
					tabBarLabel: "Decoder",
					tabBarIcon: () => null, // TODO: Add icons
				}}
			/>
			<Tab.Screen
				name="Coach"
				component={CoachScreen}
				options={{
					tabBarLabel: "Coach",
					tabBarIcon: () => null, // TODO: Add icons
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarLabel: "Profile",
					tabBarIcon: () => null, // TODO: Add icons
				}}
			/>
		</Tab.Navigator>
	);
};

export const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="MainTabs" component={MainTabs} />
				<Stack.Screen
					name="Paywall"
					component={PaywallScreen}
					options={{
						presentation: "modal",
						headerShown: true,
						title: "Upgrade to Pro",
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
