'use client'
import { app } from "@/lib/firebase";
import { generateFirestoreData, mockTransactionList } from "@/lib/mock";
import { AppContextType, ICategory, ICategoryFlat, ITransaction } from "@/lib/types";
import { Auth, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AppContext = createContext<AppContextType>({
	auth: getAuth(app),
	transactions: mockTransactionList(),
	categories: [],
	rootCategory: {
		categoryId: "root",
		name: "Root",
		icon: "https://picsum.photos/seed/root/200",
		color: "#8884d8",
		maxSpend: 0,
		parentId: "root",
		children: {}
	},
	plannedTransactions: mockTransactionList(),
	income: 0,
	expense: 0,
	balance: 0
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

	const [categories, setCategories] = useState<ICategoryFlat[]>([]);
	const [rootCategory, setRootCategory] = useState<ICategory>({
		categoryId: "root",
		name: "Root",
		icon: "https://picsum.photos/seed/root/200",
		color: "#8884d8",
		maxSpend: 0,
		parentId: "root",
		children: {}
	});
	const [transactions, setTransactions] = useState<ITransaction[]>(mockTransactionList());
	const [plannedTransactions, setPlannedTransactions] = useState<ITransaction[]>(mockTransactionList());
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [balance, setBalance] = useState(0);
	const { auth } = useContext(AppContext);

	const reconstructTree = (catArr: ICategoryFlat[]): Record<string, ICategory> => {
		const categoryMap: Record<string, ICategory> = {};
		const rootChildren: Record<string, ICategory> = {};

		// Pass 1
		for (const fc of catArr) {
			categoryMap[fc.categoryId] = {
				categoryId: fc.categoryId,
				name: fc.name,
				icon: fc.icon,
				color: fc.color,
				maxSpend: fc.maxSpend,
				parentId: fc.parentId,
				children: {}
			}
		}

		// Pass 2
		for (const fc of catArr) {
			if (fc.parentId == "root") {
				rootChildren[fc.categoryId] = categoryMap[fc.categoryId];
			} else {
				const parentNode = categoryMap[fc.parentId]
				if (parentNode) {
					parentNode.children[fc.categoryId] = categoryMap[fc.categoryId];
				}
			}
		}

		return rootChildren;
	}

	useEffect(() => {
		let balance = 0;
		let income = 0;
		let expense = 0;

		for (let i = 0; i < transactions.length; i++) {
			const transaction = transactions[i];
			if (transaction.amount > 0) {
				income += transaction.amount;
			} else {
				expense += -transaction.amount;
			}
			balance += transaction.amount;
		}

		setIncome(income);
		setExpense(expense);
		setBalance(balance);

		const rootCat: ICategory = {
			categoryId: "root",
			name: "Root",
			icon: "https://picsum.photos/seed/root/200",
			color: "#8884d8",
			maxSpend: income,
			parentId: "root",
			children: {}
		}
		const rootChildren = reconstructTree(categories);
		rootCat.children = rootChildren;
		setRootCategory(rootCat);
	}, [transactions, categories]);

	useEffect(() => {
		const db = getFirestore(app);

		const unsub = onAuthStateChanged(auth, (user) => {
			if (!user || user == null) {
				console.log("No user logged in");
				return;
			}

			let income = 0;
			for (let i = 0; i < transactions.length; i++) {
				const transaction = transactions[i];
				if (transaction.amount > 0) {
					income += transaction.amount;
				}
			}

			const categoriesRef = collection(db, "tenants", auth.tenantId as string, "users", user.uid, "categories");
			const catq = query(categoriesRef);
			onSnapshot(catq, (snapshot) => {
				const categories: ICategory[] = [];
				if (snapshot.empty) {
					generateFirestoreData(user);
					return;
				}
				snapshot.forEach((doc) => {
					let category = doc.data() as ICategory;
					categories.push(category);
				});
				setCategories(categories);
			});

			const userTransactionsRef = collection(db, "tenants", auth.tenantId as string, "users", user.uid, "transactions");
			const tq = query(userTransactionsRef, orderBy("date", "desc"));
			onSnapshot(tq, (snapshot) => {
				const transactions: ITransaction[] = [];
				snapshot.forEach((doc) => {
					let transaction = doc.data() as ITransaction;
					transaction.date = new Date((transaction.date as any).seconds * 1000);
					transactions.push(transaction);
				});
				setTransactions(transactions);
			});

			const plannedTransactionsRef = collection(db, "tenants", auth.tenantId as string, "users", user.uid, "plannedTransactions");
			const ptq = query(plannedTransactionsRef, orderBy("date", "desc"));
			onSnapshot(ptq, (snapshot) => {
				const transactions: ITransaction[] = [];
				snapshot.forEach((doc) => {
					let transaction = doc.data() as ITransaction;
					transaction.date = new Date((transaction.date as any).seconds * 1000);
					transactions.push(transaction);
				});
				setPlannedTransactions(transactions);
			})
		})


		return () => {
			unsub();
		}
	}, []);

	return (
		<AppContext.Provider value={{
			auth: getAuth(app),
			categories,
			rootCategory,
			transactions,
			plannedTransactions,
			income,
			expense,
			balance
		}}>
			{children}
		</AppContext.Provider>
	);
}

export const useAppContext = () => useContext(AppContext);
