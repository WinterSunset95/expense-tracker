import React, { forwardRef, RefObject, ReactNode, useState, useImperativeHandle, useRef, createContext, useContext } from "react";

export const drawerScreenModes = ["full", "partial"] as const;
export const drawerDirections = ["left", "right", "top", "bottom"] as const;
export type DrawerScreenMode = typeof drawerScreenModes[number];
export type DrawerDirection = typeof drawerDirections[number];

export type DrawerContextType = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	state: boolean;
	child: ReactNode;
	setChild: (child: ReactNode) => void;
	setDrawerScreenMode: (mode: DrawerScreenMode) => void;
	setDrawerDirection: (direction: DrawerDirection) => void;
};

const DrawerContext = createContext<DrawerContextType>({
	open: () => {},
	close: () => {},
	toggle: () => {},
	state: false,
	child: null,
	setChild: (child: ReactNode) => {},
	setDrawerScreenMode: (mode: DrawerScreenMode) => {},
	setDrawerDirection: (direction: DrawerDirection) => {},
});

export interface DrawerApi {
	open: () => void;
	close: () => void;
	setApi: (api: DrawerApi) => void;
	setChild: (child: ReactNode) => void;
}

export const DrawerV2 = forwardRef<DrawerApi, { children?: ReactNode }>(({ children }, ref) => {
	const [child, setChild] = useState<ReactNode>(null);
	const { open: openDrawer, close: closeDrawer, state } = useDrawerContext();

	useImperativeHandle(ref, () => ({
		open: () => {
			openDrawer();
		},
		close: () => {
			closeDrawer();
		},
		setApi: (api: DrawerApi) => {
			api.setChild(child);
		},
		setChild: (child: ReactNode) => {
			setChild(child);
		}
	}));

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
			${state ? "bg-[rgba(0,0,0,0.5)]" : "bg-[rgba(0,0,0,0)]"}
			transition
			${state ? "pointer-events-auto" : "pointer-events-none"}
		`}>
			<div className={`
				w-full
				h-full
				flex
				flex-col
				justify-center
				items-center
			`}>
				<div className="w-full h-full grow" onClick={() => closeDrawer()}></div>
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
					${state ? "translate-y-0" : "translate-y-full"}
				`}>
					{children ? children : child}
				</div>
			</div>
		</div>
	);
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
	const [child, setChild] = useState<ReactNode>(null);
	const [screenMode, setScreenMode] = useState<DrawerScreenMode>("full");
	const [direction, setDirection] = useState<DrawerDirection>("bottom");

	const open = () => {
		setShown(true);
	}

	const close = () => {
		setShown(false);
		setChild(null);
	}

	const toggle = () => {
		setShown(!shown);
	}

	const setThisChild = (child: ReactNode) => {
		setChild(child);
	}

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	}

	return (
		<DrawerContext.Provider value={{ open, close, toggle, state: shown, child, setChild: setThisChild, setDrawerScreenMode: setScreenMode, setDrawerDirection: setDirection }}>
			{children}
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
				${shown ? "bg-[rgba(0,0,0,0.5)]" : "bg-[rgba(0,0,0,0)]"}
				transition
				${shown ? "pointer-events-auto" : "pointer-events-none"}
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
						${screenMode === "full" ? "h-full" : "h-auto"}
						bg-primary-foreground
						p-2
						flex
						flex-col
						justify-center
						items-center
						transition
						duration-500
						${shown ? "translate-y-0" : "translate-y-full"}
					`} onClick={(e) => handleClick(e)}>
						{child ? child : <div>No child set</div>}
					</div>
				</div>
			</div>
		</DrawerContext.Provider>
	);
}

export const useDrawerContext = () => useContext(DrawerContext);


