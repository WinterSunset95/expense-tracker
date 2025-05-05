import { DashboardContextType, ITransaction } from "@/lib/types";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const DashboardContext = createContext<DashboardContextType>({
	transaction: {
		transactionId: "",
		amount: 0,
		currency: "",
		date: new Date(),
		category: "",
		description: "",
		paymentMethod: "",
		isRecurring: false
	},
	setTransaction: () => {}
});

export const DashboardProvider = ({ children } : { children: ReactNode }) => {

	const [transaction, setTransaction] = useState<ITransaction>({
		transactionId: "",
		amount: 0,
		currency: "",
		date: new Date(),
		category: "",
		description: "",
		paymentMethod: "",
		isRecurring: false
	});

	return (
		<DashboardContext.Provider value={{ transaction, setTransaction }}>
			{children}
		</DashboardContext.Provider>
	);
}

export const useDashboardContext = () => useContext(DashboardContext);
