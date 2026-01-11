import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { revenueCatService } from "@/services/revenuecat.service";

interface SubscriptionState {
	customerInfo: CustomerInfo | null;
	isProUser: boolean;
	isLoading: boolean;
	error: string | null;
	packages: PurchasesPackage[];
}

interface SubscriptionActions {
	setCustomerInfo: (customerInfo: CustomerInfo) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setPackages: (packages: PurchasesPackage[]) => void;
	fetchCustomerInfo: () => Promise<void>;
	fetchOfferings: () => Promise<void>;
	purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
	restorePurchases: () => Promise<void>;
	reset: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

const initialState: SubscriptionState = {
	customerInfo: null,
	isProUser: false,
	isLoading: false,
	error: null,
	packages: [],
};

export const useSubscriptionStore = create<SubscriptionStore>()(
	persist(
		(set, get) => ({
			...initialState,

			setCustomerInfo: (customerInfo: CustomerInfo) => {
				const isProUser = revenueCatService.hasProAccess(customerInfo);
				set({ customerInfo, isProUser });
			},

			setLoading: (loading: boolean) => set({ isLoading: loading }),

			setError: (error: string | null) => set({ error }),

			setPackages: (packages: PurchasesPackage[]) => set({ packages }),

			fetchCustomerInfo: async () => {
				try {
					set({ isLoading: true, error: null });
					const customerInfo = await revenueCatService.getCustomerInfo();
					get().setCustomerInfo(customerInfo);
				} catch (error) {
					const errorMessage =
						error instanceof Error
							? error.message
							: "Failed to fetch customer info";
					set({ error: errorMessage });
					console.error("Error fetching customer info:", error);
				} finally {
					set({ isLoading: false });
				}
			},

			fetchOfferings: async () => {
				try {
					set({ isLoading: true, error: null });
					const packages = await revenueCatService.getOfferings();
					set({ packages });
				} catch (error) {
					const errorMessage =
						error instanceof Error
							? error.message
							: "Failed to fetch offerings";
					set({ error: errorMessage });
					console.error("Error fetching offerings:", error);
				} finally {
					set({ isLoading: false });
				}
			},

			purchasePackage: async (pkg: PurchasesPackage): Promise<boolean> => {
				try {
					set({ isLoading: true, error: null });
					const { customerInfo, cancelled } =
						await revenueCatService.purchasePackage(pkg);

					if (!cancelled) {
						get().setCustomerInfo(customerInfo);
						return true;
					}

					return false;
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : "Purchase failed";
					set({ error: errorMessage });
					console.error("Error purchasing package:", error);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			restorePurchases: async () => {
				try {
					set({ isLoading: true, error: null });
					const customerInfo = await revenueCatService.restorePurchases();
					get().setCustomerInfo(customerInfo);
				} catch (error) {
					const errorMessage =
						error instanceof Error
							? error.message
							: "Failed to restore purchases";
					set({ error: errorMessage });
					console.error("Error restoring purchases:", error);
				} finally {
					set({ isLoading: false });
				}
			},

			reset: () => set(initialState),
		}),
		{
			name: "subscription-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				customerInfo: state.customerInfo,
				isProUser: state.isProUser,
			}),
		},
	),
);
