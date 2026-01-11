/**
 * Shared subscription constants for Between Us
 * Used by both mobile and backend for consistent subscription management
 */

/**
 * RevenueCat Entitlement Identifiers
 */
export const ENTITLEMENTS = {
	PRO: "BetweenUs Pro",
} as const;

/**
 * RevenueCat Product Identifiers
 */
export const PRODUCTS = {
	MONTHLY: "monthly",
	YEARLY: "yearly",
} as const;

/**
 * RevenueCat API Keys (from environment variables)
 */
export const REVENUECAT_API_KEYS = {
	ios: process.env.REVENUECAT_API_KEY_IOS || "test_VjVMKOlkOVmdbFNrRxDRZcTmbjB",
	android:
		process.env.REVENUECAT_API_KEY_ANDROID ||
		"test_VjVMKOlkOVmdbFNrRxDRZcTmbjB",
} as const;

/**
 * Subscription Tier Types
 */
export type SubscriptionTier = "free" | "pro";

/**
 * Feature Types
 */
export type FeatureType = "decoder" | "coach" | "insights";

/**
 * Usage Limits by Subscription Tier
 */
export const SUBSCRIPTION_LIMITS = {
	free: {
		decoder: 3, // Love Decoder analyses per day
		coach: 5, // Coach messages per day
		insights: Infinity, // Daily Insight (always available)
		historyRetention: 7, // Days to retain history
		suggestedReplies: false, // AI-powered reply suggestions
	},
	pro: {
		decoder: Infinity, // Unlimited Love Decoder
		coach: Infinity, // Unlimited Coach messages
		insights: Infinity, // Daily Insight (always available)
		historyRetention: 365, // Days to retain history
		suggestedReplies: true, // AI-powered reply suggestions
	},
} as const;

/**
 * Subscription Plan Pricing (for display purposes)
 */
export const SUBSCRIPTION_PRICING = {
	monthly: {
		price: 9.99,
		currency: "USD",
		interval: "month" as const,
		trialDays: 0,
	},
	yearly: {
		price: 99.99,
		currency: "USD",
		interval: "year" as const,
		trialDays: 0,
		savings: "17% off", // vs monthly
	},
} as const;

/**
 * Feature Names for Display
 */
export const FEATURE_NAMES: Record<FeatureType, string> = {
	decoder: "Love Decoder",
	coach: "Dating Coach",
	insights: "Daily Insights",
};

/**
 * Get usage limit for a specific feature and tier
 */
export function getUsageLimit(
	tier: SubscriptionTier,
	feature: FeatureType,
): number {
	return SUBSCRIPTION_LIMITS[tier][feature];
}

/**
 * Check if a tier has a specific feature enabled
 */
export function hasFeatureAccess(
	tier: SubscriptionTier,
	feature: string,
): boolean {
	if (feature === "suggestedReplies") {
		return SUBSCRIPTION_LIMITS[tier].suggestedReplies;
	}
	return true; // All other features available to all tiers (with limits)
}
