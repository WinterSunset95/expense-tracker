import { ICategory, ITransaction } from "./types";

export function generateColor(original: string, seed: string): string {
	// original has to be a hex color
	// seed can be anything
	// Get r, g, b
	if (!original) return "#000000";
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

/*
* Returns an array of all subcategories of an ICategory object
* @param root The node whose subcategories we want
* @returns An array of ICategory objects
*/
export function getAllSubCategories(root: ICategory): ICategory[] {
	const arr: ICategory[] = [];
	for (const childKey in root.children) {
		arr.push(root.children[childKey]);
		if (root.children[childKey].children) {
			const result = getAllSubCategories(root.children[childKey]);
			arr.push(...result);
		}
	}
	return arr;
}

/**
* When a category is deleted, all transactions under it are moved to the parent
* This function returns the new list of transactions
* The caller is responsible for updating the transactions
* @param transactions The list of transactions
* @param deletedCat The category that was deleted
* @param root The root category
* @returns The new root category with the deleted node and a list of the updated transactions
*/
export function handleTransactionParentDeleted(transactions: ITransaction[], deletedCat: ICategory, root: ICategory): {
	newRoot: ICategory,
	newTransactions: ITransaction[]
} {
	// Clone the root
	const newRoot = JSON.parse(JSON.stringify(root)) as ICategory;
	// Get a reference to the parent of the category to be deleted
	const parentOfDeletedCat = getParentNode(deletedCat, newRoot);
	// Get a list of all subcategories first
	const allSubCategories = getAllSubCategories(deletedCat);
	// Remove the deleted category from the parent's children
	delete parentOfDeletedCat.children[deletedCat.categoryId];

	const newTransactions: ITransaction[] = [];
	// For every transaction that matches the deleted category, or a subcategory of the deleted category, set the category to the parent of the deleted category
	for (let i = 0; i < transactions.length; i++) {
		if (transactions[i].category === deletedCat.categoryId || allSubCategories.find((cat) => cat.categoryId === transactions[i].category)) {
			const updatedTransaction = JSON.parse(JSON.stringify(transactions[i])) as ITransaction;
			updatedTransaction.category = parentOfDeletedCat.categoryId;
			newTransactions.push(updatedTransaction);
		}
	}

	return {
		newRoot,
		newTransactions
	};
}
