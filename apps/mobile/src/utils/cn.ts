import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for conditional class names with NativeWind
 * Combines clsx for conditional logic and tailwind-merge for proper Tailwind class merging
 *
 * @example
 * cn('px-2 py-1', condition && 'px-4') // 'py-1 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
