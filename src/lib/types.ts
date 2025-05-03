export interface ITransaction {
	transactionId: string;
	amount: number;
	currency: string;
	date: number;
	category: string; // The category ID
	parentCategory: "1" | "2" | "3" | "4";
	description: string;
	paymentMethod: string;
	isRecurring: boolean;
	recurringInterval?: number;
}

export interface IMainCategory {
	categoryId: string;
	name: string;
	icon: string;
}

export interface ICategory {
	categoryId: string;
	parentCategoryId: "1" | "2" | "3" | "4";
	name: string;
	icon: string;
}

export const mainCategoryMap: Record<string, IMainCategory> = {
	"1": {
		categoryId: "1",
		name: "Needs",
		icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
	},
	"2": {
		categoryId: "2",
		name: "Wants",
		icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
	},
	"3": {
		categoryId: "3",
		name: "Investments",
		icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
	},
	"4": {
		categoryId: "4",
		name: "Income",
		icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
	},
}
