import { Text, View } from "react-native";

interface FeatureItemProps {
	icon: string;
	title: string;
	description: string;
}

export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
	return (
		<View className="flex-row items-start">
			<Text className="text-2xl mr-3">{icon}</Text>
			<View className="flex-1">
				<Text className="text-base font-semibold text-gray-900 mb-1">
					{title}
				</Text>
				<Text className="text-sm text-gray-600">{description}</Text>
			</View>
		</View>
	);
};
