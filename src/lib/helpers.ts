
export function generateColor(original: string, seed: string): string {
	// original has to be a hex color
	// seed can be anything
	// Get r, g, b
	const r = parseInt(original.slice(1, 3), 16);
	const g = parseInt(original.slice(3, 5), 16);
	const b = parseInt(original.slice(5, 7), 16);
	// Generate a hash from the seed
	const hash = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
	// Calculate new r, g, b
	const nr = (r + hash) % 256;
	const ng = (g + hash) % 256;
	const nb = (b + hash) % 256;
	// Return the new color
	return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

export function colorIsDark(colorhex: string): boolean {
	const r = parseInt(colorhex.slice(1, 3), 16);
	const g = parseInt(colorhex.slice(3, 5), 16);
	const b = parseInt(colorhex.slice(5, 7), 16);

	const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	return yiq < 128;

}
