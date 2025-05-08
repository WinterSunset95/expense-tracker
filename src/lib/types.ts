import { DrawerApi } from "@/components/Drawer";
import { Auth } from "firebase/auth";
import { Dispatch, Ref, RefObject, SetStateAction } from "react";

export interface ITransaction {
	transactionId: string;
	amount: number;
	currency: string;
	date: Date;
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
	color: string;
	maxSpend: number;
	parentId: string;
	children: Record<string, ICategory>;
}

export interface ICategoryFlat {
	categoryId: string;
	name: string;
	icon: string;
	color: string;
	maxSpend: number;
	parentId: string;
}

export interface IPieData {
	id: string;
	name: string;
	value: number;
	color: string;
}

export interface AppContextType {
	auth: Auth;
	transactions: ITransaction[];
	categories: ICategoryFlat[];
	rootCategory: ICategory;
	plannedTransactions: ITransaction[];
	income: number;
	expense: number;
	balance: number;
}

const transactionUpdateModes = ["income", "expense", "expense-update", "income-update", "planned-expense"] as const;
export type TransactionUpdateMode = typeof transactionUpdateModes[number];

export interface ICurrency {
	symbol: string;
	name: string;
	shortName: string;
	decimalDigits: number;
	symbolFirst: boolean;
	flagURL: string;
}

// Default values
export const ICurrencies: Record<string, ICurrency> = {
	"INR": {
		symbol: "₹",
		name: "Indian Rupee",
		shortName: "INR",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/in.svg",
	},
	"PHP": {
		symbol: "₱",
		name: "Philippine Peso",
		shortName: "PHP",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/ph.svg",
	},
	"USD": {
		symbol: "$",
		name: "US Dollar",
		shortName: "USD",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/us.svg",
	},
	"EUR": {
		symbol: "€",
		name: "Euro",
		shortName: "EUR",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/eu.svg",
	},
	"GBP": {
		symbol: "£",
		name: "British Pound",
		shortName: "GBP",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/gb.svg",
	},
	"CAD": {
		symbol: "$",
		name: "Canadian Dollar",
		shortName: "CAD",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/ca.svg",
	},
	"AUD": {
		symbol: "$",
		name: "Australian Dollar",
		shortName: "AUD",
		decimalDigits: 2,
		symbolFirst: true,
		flagURL: "https://flagcdn.com/au.svg",
	},
	"JPY": {
		symbol: "¥",
		name: "Japanese Yen",
		shortName: "JPY",
		decimalDigits: 0,
		symbolFirst: false,
		flagURL: "https://flagcdn.com/jp.svg",
	},
};

// Default values
export const ICategories: ICategory[] = [
	{
		categoryId: "needs",
		name: "Needs",
		icon: "https://picsum.photos/seed/needs/200",
		color: "#0010FF",
		maxSpend: 0,
		parentId: "root",
		children: {},
	},
	{
		categoryId: "wants",
		name: "Wants",
		color: "#FF0100",
		maxSpend: 0,
		icon: "https://picsum.photos/seed/wants/200",
		parentId: "root",
		children: {},
	},
	{
		categoryId: "savings",
		name: "Savings",
		icon: "https://picsum.photos/seed/savings/200",
		color: "#01FF00",
		maxSpend: 0,
		parentId: "root",
		children: {},
	},
]
