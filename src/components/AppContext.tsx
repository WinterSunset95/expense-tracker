import { app } from "@/lib/firebase";
import { generateFirestoreData, mockTransactionList } from "@/lib/mock";
import { AppContextType, ICategory, ITransaction } from "@/lib/types";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [auth, setAuth] = useState<Auth | null>(null);
	const [rootCategory, setRootCategory] = useState<Record<string, ICategory>>({
		"needs": {
			categoryId: "needs",
			name: "Needs",
			icon: "https://picsum.photos/seed/needs/200",
			children: {
				"groceries": {
					categoryId: "groceries",
					name: "Groceries",
					icon: "https://picsum.photos/seed/groceries/200",
					children: {}
				},
				"rent": {
					categoryId: "rent",
					name: "Rent",
					icon: "https://picsum.photos/seed/rent/200",
					children: {}
				}
			}
		},
		"wants": {
			categoryId: "wants",
			name: "Wants",
			icon: "https://picsum.photos/seed/wants/200",
			children: {
				"entertainment": {
					categoryId: "entertainment",
					name: "Entertainment",
					icon: "https://picsum.photos/seed/entertainment/200",
					children: {
						"movies": {
							categoryId: "movies",
							name: "Movies",
							icon: "https://picsum.photos/seed/movies/200",
							children: {}
						}
					}
				},
				"misc": {
					categoryId: "misc",
					name: "Misc",
					icon: "https://picsum.photos/seed/misc/200",
					children: {}
				}
			}
		},
		"savings": {
			categoryId: "savings",
			name: "Savings",
			icon: "https://picsum.photos/seed/savings/200",
			children: {}
		}
	});
	const [transactions, setTransactions] = useState<ITransaction[]>(mockTransactionList());
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [balance, setBalance] = useState(0);

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

		const auth = getAuth(app);
		const db = getFirestore(app);

		const unsub = onAuthStateChanged(auth, (user) => {
			if (auth.currentUser) {
				setAuth(auth);
				const rootCategoryRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "categories");
				getDocs(rootCategoryRef)
				.then((snapshot) => {
					const categories: Record<string, ICategory> = {};
					snapshot.forEach((doc) => {
						console.log(doc.data());
						const category = doc.data() as ICategory;
						categories[category.categoryId] = category;
					});
					setRootCategory(categories);
				})
				.catch((error) => {
					console.log(error);
					if (!auth.currentUser) {
						return
					}
					generateFirestoreData(auth.currentUser);
				})
				const userTransactionsRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "transactions");
				getDocs(userTransactionsRef)
				.then((snapshot) => {
					const transactions: ITransaction[] = [];
					snapshot.forEach((doc) => {
						const transaction = doc.data() as ITransaction;
						transactions.push(transaction);
					});
					setTransactions(transactions);
				})
				.catch((error) => {
					console.log(error);
				})
			}
		})

		return () => {
			unsub();
		}
	}, []);

	return (
		<AppContext.Provider value={{
			auth,
			rootCategories: rootCategory,
			transactions,
			income,
			expense,
			balance
		}}>
			{children}
		</AppContext.Provider>
	);
}

export const useAppContext = () => useContext(AppContext);
