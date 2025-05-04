import { Auth } from "firebase/auth";

export interface ITransaction {
	transactionId: string;
	amount: number;
	currency: string;
	date: number;
	category: string; // The category ID
	description: string;
	paymentMethod: string;
	isRecurring: boolean;
	recurringInterval?: number;
}

export interface IUser {
	userId: string;
	name: string;
	email: string;
	categories: Record<string, ICategory>;
}

export interface ICategory {
	categoryId: string;
	name: string;
	icon: string;
	children: Record<string, ICategory>;
}

export interface AppContextType {
	auth: Auth | null;
	rootCategories: Record<string, ICategory>;
	transactions: ITransaction[];
	income: number;
	expense: number;
	balance: number;
}
