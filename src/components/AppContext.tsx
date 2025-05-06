'use client'
import { app } from "@/lib/firebase";
import { generateFirestoreData, mockTransactionList } from "@/lib/mock";
import { AppContextType, ICategory, ITransaction } from "@/lib/types";
import { Auth, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AppContext = createContext<AppContextType>({
	auth: getAuth(app),
	transactions: mockTransactionList(),
	plannedTransactions: mockTransactionList(),
	rootCategory: {
		categoryId: "root",
		name: "Root",
		icon: "https://picsum.photos/seed/root/200",
		children: {}
	},
	income: 0,
	expense: 0,
	balance: 0
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [rootCategory, setRootCategory] = useState<ICategory>({
		categoryId: "root",
		name: "Root",
		icon: "https://picsum.photos/seed/root/200",
		children: {}
	});
	const [transactions, setTransactions] = useState<ITransaction[]>(mockTransactionList());
	const [plannedTransactions, setPlannedTransactions] = useState<ITransaction[]>(mockTransactionList());
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [balance, setBalance] = useState(0);
	const { auth } = useContext(AppContext);

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
	}, [transactions]);

	useEffect(() => {
		const db = getFirestore(app);

		const unsub = onAuthStateChanged(auth, (user) => {
			if (!user || user == null) {
				console.log("No user logged in");
				return;
			}

			const userRef = doc(db, "tenants", user.tenantId as string, "users", user.uid);
			console.log("generated listener");
			onSnapshot(userRef, (snapshot) => {
				const categories = snapshot.get("categories") as Record<string, ICategory>;
				if (!categories) {
					generateFirestoreData(user);
				}
				setRootCategory({
					categoryId: "root",
					name: "Root",
					icon: "https://picsum.photos/seed/root/200",
					children: categories
				});
			})

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
