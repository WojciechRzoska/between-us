import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, Text, View } from "react-native";
import { PaywallFooterContainerView } from "react-native-purchases-ui";
import { FeatureItem } from "@/components/subscription/FeatureItem";
import { useSubscriptionStore } from "@/store/subscriptionStore";

type RootStackParamList = {
	Paywall: undefined;
	Home: undefined;
};

type PaywallScreenProps = NativeStackScreenProps<RootStackParamList, "Paywall">;

export const PaywallScreen = ({ navigation }: PaywallScreenProps) => {
	const { fetchCustomerInfo } = useSubscriptionStore();

	const handlePurchaseCompleted = async () => {
		// Refresh customer info after purchase
		await fetchCustomerInfo();

		// Navigate back to previous screen
		navigation.goBack();
	};

	const handleRestoreCompleted = async () => {
		// Refresh customer info after restore
		await fetchCustomerInfo();

		// Navigate back to previous screen
		navigation.goBack();
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1 px-6 pt-8">
				{/* Header */}
				<View className="mb-8">
					<Text className="text-3xl font-bold text-gray-900 mb-2">
						Unlock BetweenUs Pro
					</Text>
					<Text className="text-base text-gray-600">
						Get unlimited access to all features and take your relationship to
						the next level
					</Text>
				</View>

				{/* Features List */}
				<View className="mb-8 space-y-4">
					<FeatureItem
						icon="✨"
						title="Unlimited Love Decoder"
						description="Analyze as many messages as you want"
					/>
					<FeatureItem
						icon="💬"
						title="Unlimited Coach Messages"
						description="Get expert advice whenever you need it"
					/>
					<FeatureItem
						icon="💡"
						title="Suggested Replies"
						description="Get AI-powered reply suggestions"
					/>
					<FeatureItem
						icon="📚"
						title="Extended History"
						description="Access your analysis history for up to 1 year"
					/>
				</View>

				{/* Spacer to push paywall to bottom */}
				<View className="flex-1" />

				{/* RevenueCat Paywall Footer */}
				<PaywallFooterContainerView
					onPurchaseCompleted={handlePurchaseCompleted}
					onRestoreCompleted={handleRestoreCompleted}
					onDismiss={() => navigation.goBack()}
				/>
			</View>
		</SafeAreaView>
	);
};
