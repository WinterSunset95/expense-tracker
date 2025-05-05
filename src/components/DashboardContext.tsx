import { DashboardContextType, ITransaction } from "@/lib/types";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import UpdateTransaction, { UpdaterHandle } from "./UpdateTransaction";
import { Drawer } from "./Drawer";

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children } : { children: ReactNode }) => {

	const [transaction, setTransaction] = useState<ITransaction | null>(null);

	const updaterRef = useRef<UpdaterHandle>({
		setTransaction,
		setMode: () => {},
		open: () => {},
		close: () => {}
	});

	return (
		<DashboardContext.Provider value={{ updaterRef }}>
			{children}
			<Drawer>
				<UpdateTransaction ref={updaterRef} />
			</Drawer>
		</DashboardContext.Provider>
	);
}

export const useDashboardContext = () => {
	const context = useContext(DashboardContext)
	if (!context) {
		throw new Error("useDashboardContext must be used within a <DashboardProvider />")
	}
	return context;
}
