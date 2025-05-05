import React, { forwardRef, RefObject, ReactNode, useState, useImperativeHandle, useRef, createContext, useContext } from "react";

export type DrawerContextType = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	state: boolean;
};

const DrawerContext = createContext<DrawerContextType>({
	open: () => {},
	close: () => {},
	toggle: () => {},
	state: false,
});

export const Drawer: React.FC<{ children: ReactNode }> = ({ children }) => {

	const { toggle, state: open } = useDrawerContext();

	return (
		<div className={`
			fixed
			top-0
			left-0
			w-full
			h-full
			flex
			items-center
			justify-center
			z-50
			${open ? "bg-[rgba(0,0,0,0.5)]" : "bg-[rgba(0,0,0,0)]"}
			transition
			${open ? "pointer-events-auto" : "pointer-events-none"}
		`}>
			<div className={`
				w-full
				h-full
				flex
				flex-col
				justify-center
				items-center
			`}>
				<div className="w-full h-full grow" onClick={() => toggle()}></div>
				<div className={`
					w-full
					bg-primary-foreground
					p-2
					flex
					flex-col
					justify-center
					items-center
					transition
					duration-500
					${open ? "translate-y-0" : "translate-y-full"}
				`}>
					{children}
				</div>
			</div>
		</div>
	);
}

export const DrawerProvider = ({ children } : { children: ReactNode }) => {
	const [shown, setShown] = useState(false);

	const open = () => {
		setShown(true);
	}

	const close = () => {
		setShown(false);
	}

	const toggle = () => {
		setShown(!shown);
	}

	return (
		<DrawerContext.Provider value={{ open, close, toggle, state: shown }}>
			{children}
		</DrawerContext.Provider>
	);
}

export const useDrawerContext = () => useContext(DrawerContext);


