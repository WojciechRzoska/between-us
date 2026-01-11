import { ENTITLEMENTS, REVENUECAT_API_KEYS } from "@betweenus/shared-constants";
import { Platform } from "react-native";
import Purchases, {
	type CustomerInfo,
	LOG_LEVEL,
	type PurchasesPackage,
} from "react-native-purchases";

class RevenueCatService {
	private initialized = false;

	/**
	 * Initialize RevenueCat SDK
	 * Should be called once on app startup
	 */
	async initialize(userId?: string): Promise<void> {
		if (this.initialized) {
			console.warn("RevenueCat already initialized");
			return;
		}

		try {
			const apiKey = Platform.select({
				ios: REVENUECAT_API_KEYS.ios,
				android: REVENUECAT_API_KEYS.android,
			});

			if (!apiKey) {
				throw new Error("RevenueCat API key not found for platform");
			}

			Purchases.setLogLevel(LOG_LEVEL.DEBUG);

			await Purchases.configure({
				apiKey,
				appUserID: userId,
			});

			this.initialized = true;
			console.log("RevenueCat initialized successfully");
		} catch (error) {
			console.error("Failed to initialize RevenueCat:", error);
			throw error;
		}
	}

	/**
	 * Get current customer info
	 */
	async getCustomerInfo(): Promise<CustomerInfo> {
		try {
			return await Purchases.getCustomerInfo();
		} catch (error) {
			console.error("Failed to get customer info:", error);
			throw error;
		}
	}

	/**
	 * Check if user has Pro entitlement
	 */
	hasProAccess(customerInfo: CustomerInfo): boolean {
		return customerInfo.entitlements.active[ENTITLEMENTS.PRO] !== undefined;
	}

	/**
	 * Get available packages/offerings
	 */
	async getOfferings(): Promise<PurchasesPackage[]> {
		try {
			const offerings = await Purchases.getOfferings();

			if (
				!offerings.current ||
				offerings.current.availablePackages.length === 0
			) {
				console.warn("No offerings available");
				return [];
			}

			return offerings.current.availablePackages;
		} catch (error) {
			console.error("Failed to get offerings:", error);
			throw error;
		}
	}

	/**
	 * Purchase a package
	 */
	async purchasePackage(
		pkg: PurchasesPackage,
	): Promise<{ customerInfo: CustomerInfo; cancelled: boolean }> {
		try {
			const { customerInfo, productIdentifier } =
				await Purchases.purchasePackage(pkg);

			console.log("Purchase successful:", productIdentifier);

			return {
				customerInfo,
				cancelled: false,
			};
		} catch (error) {
			// User cancelled the purchase
			if (error && typeof error === "object" && "userCancelled" in error) {
				console.log("User cancelled purchase");
				return {
					customerInfo: await this.getCustomerInfo(),
					cancelled: true,
				};
			}

			console.error("Purchase failed:", error);
			throw error;
		}
	}

	/**
	 * Restore previous purchases
	 */
	async restorePurchases(): Promise<CustomerInfo> {
		try {
			const customerInfo = await Purchases.restorePurchases();
			console.log("Purchases restored successfully");
			return customerInfo;
		} catch (error) {
			console.error("Failed to restore purchases:", error);
			throw error;
		}
	}

	/**
	 * Identify user (should be called after login)
	 */
	async identifyUser(userId: string): Promise<CustomerInfo> {
		try {
			const { customerInfo } = await Purchases.logIn(userId);
			console.log("User identified:", userId);
			return customerInfo;
		} catch (error) {
			console.error("Failed to identify user:", error);
			throw error;
		}
	}

	/**
	 * Logout user (should be called on logout)
	 */
	async logoutUser(): Promise<CustomerInfo> {
		try {
			const { customerInfo } = await Purchases.logOut();
			console.log("User logged out from RevenueCat");
			return customerInfo;
		} catch (error) {
			console.error("Failed to logout user:", error);
			throw error;
		}
	}

	/**
	 * Check if initialized
	 */
	isInitialized(): boolean {
		return this.initialized;
	}
}

export const revenueCatService = new RevenueCatService();
