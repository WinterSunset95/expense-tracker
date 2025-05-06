import { DashboardContextType, ITransaction } from "@/lib/types";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Drawer, DrawerApi, DrawerV2 } from "./Drawer";

const DashboardContext = createContext<DashboardContextType | null>(null);

// Decommisioned
export const DashboardProvider = ({ children } : { children: ReactNode }) => {

	const [transaction, setTransaction] = useState<ITransaction | null>(null);

	const drawerApi = useRef<DrawerApi>({
		open: () => {},
		close: () => {},
		setApi: () => {},
		setChild: () => {}
	})

	return (
		<div></div>
	);
}

export const useDashboardContext = () => {
	const context = useContext(DashboardContext)
	if (!context) {
		throw new Error("useDashboardContext must be used within a <DashboardProvider />")
	}
	return context;
}
