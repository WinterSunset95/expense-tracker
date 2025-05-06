import { ICategory } from "./types";

export function generateColor(original: string, seed: string): string {
	// original has to be a hex color
	// seed can be anything
	// Get r, g, b
	const r = parseInt(original.slice(1, 3), 16);
	const g = parseInt(original.slice(3, 5), 16);
	const b = parseInt(original.slice(5, 7), 16);
	// Generate a hash from the seed
	const hash = simpleStringHash(seed);

	const shouldLighten = (hash && 1) === 0;
	const intensityFactor = ((Math.abs(hash >> 8) % 51) + 10) / 100.0;

	let nr = r;
	let ng = g;
	let nb = b;

	if (shouldLighten) {
		// Lighten the colors
		nr += (255 - nr) * intensityFactor;
		ng += (255 - ng) * intensityFactor;
		nb += (255 - nb) * intensityFactor;
	} else {
		// Darken the colors
		nr *= intensityFactor;
		ng *= intensityFactor;
		nb *= intensityFactor;
	}

	// Round the values
	nr = Math.round(nr);
	ng = Math.round(ng);
	nb = Math.round(nb);

	// Return the new color
	return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

/**
 * A simple hash function for strings to generate a numeric value.
 * Not cryptographically secure, but sufficient for deterministic generation.
 * @param str The input string.
 * @returns A 32-bit integer hash.
 */
export function simpleStringHash(str: string): number {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function colorIsDark(colorhex: string): boolean {
	const r = parseInt(colorhex.slice(1, 3), 16);
	const g = parseInt(colorhex.slice(3, 5), 16);
	const b = parseInt(colorhex.slice(5, 7), 16);

	const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	return yiq < 128;
}

export function getParentNode(category: ICategory, root: ICategory): ICategory {
	const recurse = (cat: ICategory, curRoot: ICategory): ICategory | null => {
		for (const childKey in curRoot.children) {
			if (childKey == cat.categoryId) return curRoot;

			const found = recurse(cat, curRoot.children[childKey]);
			if (found) return found;
		}

		return null;
	}

	const result = recurse(category, root);

	if (result) {
		return result;
	}
	return root;
}

export function getNodeFromId(id: string, root: ICategory): ICategory {

	const recurse = (cat: string, curRoot: ICategory): ICategory | null => {

		for (const childKey in curRoot.children) {
			if (childKey == cat) return curRoot.children[childKey];

			const found = recurse(cat, curRoot.children[childKey]);
			if (found) return found;
		}

		return null
	}

	const result = recurse(id, root);

	if (result) {
		return result;
	}

	return root;
}
