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
	rootCategories: {
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
	},
	income: 0,
	expense: 0,
	balance: 0
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
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
				setRootCategory(categories);
			})

			const userTransactionsRef = collection(db, "tenants", auth.tenantId as string, "users", user.uid, "transactions");
			const tq = query(userTransactionsRef, orderBy("date", "desc"));
			onSnapshot(tq, (snapshot) => {
				const transactions: ITransaction[] = [];
				snapshot.forEach((doc) => {
					let transaction = doc.data() as ITransaction;
					transaction.date = new Date(transaction.date);
					console.log(transaction.date);
					transactions.push(transaction);
				});
				setTransactions(transactions);
			});

		})


		return () => {
			unsub();
		}
	}, []);

	return (
		<AppContext.Provider value={{
			auth: getAuth(app),
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
