/** Format a litre value compactly, e.g. 1200 -> "1.2k L", 450 -> "450 L" */
export const formatLiters = (liters: number): string => {
	if (Math.abs(liters) >= 1000) {
		return `${(liters / 1000).toFixed(1).replace(/\.0$/, "")}k L`;
	}
	return `${liters} L`;
};
