import { useEffect } from "react";
import Purchases from "react-native-purchases";
import { revenueCatService } from "@/services/revenuecat.service";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface UseRevenueCatOptions {
	userId?: string;
	autoFetch?: boolean;
}

/**
 * Hook to initialize RevenueCat and sync customer info
 * Should be called once in the root component (App.tsx)
 */
export const useRevenueCat = (options: UseRevenueCatOptions = {}) => {
	const { userId, autoFetch = true } = options;
	const { fetchCustomerInfo, setCustomerInfo } = useSubscriptionStore();

	useEffect(() => {
		const initializeRevenueCat = async () => {
			try {
				// Initialize SDK
				await revenueCatService.initialize(userId);

				// Fetch initial customer info
				if (autoFetch) {
					await fetchCustomerInfo();
				}

				// Set up customer info update listener
				const listener = Purchases.addCustomerInfoUpdateListener(
					(customerInfo) => {
						console.log("Customer info updated:", customerInfo);
						setCustomerInfo(customerInfo);
					},
				);

				return () => {
					listener.remove();
				};
			} catch (error) {
				console.error("Failed to initialize RevenueCat:", error);
			}
		};

		initializeRevenueCat();
	}, [userId, autoFetch, fetchCustomerInfo, setCustomerInfo]);
};
