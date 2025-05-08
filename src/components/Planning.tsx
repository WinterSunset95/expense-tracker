import { useEffect, useState } from "react";
import { useAppContext } from "./AppContext"
import PieChart2 from "./PieChart2";
import { ICategory, ITransaction } from "@/lib/types";
import { Button } from "./ui/button";
import { Pencil, PlusIcon } from "lucide-react";
import { useDrawerContext } from "./Drawer";
import PlanAdder from "./PlanAdder";
import Transactions from "./Transactions";
import { colorIsDark, generateColor, getNodeFromId, getParentNode } from "@/lib/helpers";
import CategoryUpdater from "./CategoryUpdater";

export default function Planning() {
	const { income, rootCategory, plannedTransactions } = useAppContext();
	const [currRoot, setCurrRoot] = useState(rootCategory);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [transactions, setTransactions] = useState(plannedTransactions);
	const { open, setChild } = useDrawerContext();

	const handleClick = (e: any) => {
		const currCat = currRoot.children[e.name];
		if (!currCat) {
			alert("You can only expand a category!!");
			return;
		}
		setCurrRoot(currCat);
	}

	const handleBack = (cat: ICategory) => {
		setCurrRoot(getParentNode(cat, rootCategory));
	}

	const handleAdd = () => {
		setChild(<PlanAdder category={currRoot} />);
		open();
	}

	const handleEdit = () => {
		setChild(<CategoryUpdater catId={currRoot.categoryId} />);
		open();
	}

	useEffect(() => {
		const catArray: ICategory[] = [];
		const transArray: ITransaction[] = [];
		for (const category in currRoot.children) {
			if (category != "income") {
				const currCat = currRoot.children[category];
				catArray.push(currCat);
			}
		}
		for (let i=0; i<plannedTransactions.length; i++) {
			if (plannedTransactions[i].category === currRoot.categoryId) {
				transArray.push(plannedTransactions[i]);
			}
		}
		setCategories(catArray);
		setTransactions(transArray);
	}, [currRoot]);

	useEffect(() => {
		setCurrRoot(rootCategory);
	}, [rootCategory]);

	return (
		<div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-4 overflow-auto">
			<div className="
				col-span-12
				row-span-4
			">
				<PieChart2 rootCategory={currRoot} handleClick={handleClick} handleBack={handleBack} />
			</div>
			<div className="
				col-span-12
				row-span-1
				overflow-x-auto
			">
				<div className="flex flex-nowrap items-center h-full gap-2">
				{categories.map((category) => {
					// set text color, white for dark colors, black for light
					let textColor = "text-white";
					if (colorIsDark(category.color as string)) {
						textColor = "text-white";
					} else {
						textColor = "text-black";
					}
					return (
						<Button
							className={`
								p-2
								h-full
								rounded-lg
								flex flex-col
								justify-center items-start
								gap-0
							`}
							style={{ backgroundColor: category.color }}
							key={category.categoryId}
							onClick={() => handleClick({ name: category.categoryId })}
						>
							<h1 className={`text-md md:text-lg font-bold ${textColor}`}>{category.name}</h1>
							<div className="w-full flex flex-row justify-between items-center gap-2 md:gap-4">
								<h1 className={`${textColor}`}>{category.maxSpend}</h1>
								<h2 className="bg-foreground rounded-md px-1 text-sm">{((category.maxSpend/income)*100).toFixed(2)} %</h2>
							</div>
						</Button>
					)
				})}
				{transactions.map((transaction) => {
					const node = getNodeFromId(transaction.category, currRoot);
					const nodeMaxSpend = node && node.maxSpend ? (node.maxSpend/100)*income : null;
					const myPercentage = nodeMaxSpend ? (Math.abs(transaction.amount/nodeMaxSpend)*100).toFixed(2) : null;
					const backgroundColor = generateColor(node?.color as string, transaction.transactionId);
					let textColor = "text-white"
					if (colorIsDark(backgroundColor)) {
						textColor = "text-white";
					} else {
						textColor = "text-black";
					}

					return (
						<Button
							className={`
								p-2
								h-full
								rounded-lg
								flex flex-col
								justify-center items-start
								gap-0
							`}
							style={{ backgroundColor }}
							key={transaction.transactionId}
						>
							<h1 className={`text-lg font-bold ${textColor}`}>{transaction.description}</h1>
							<div className="w-full flex flex-row justify-between items-center gap-4">
								<h1 className={`${textColor}`}>{Math.abs(transaction.amount)}</h1>
								<h2 className="bg-foreground rounded-md px-1 text-sm">{myPercentage} %</h2>
							</div>
						</Button>
					);
				})}
				<Button onClick={handleAdd} className="p-1 rounded-full h-full flex justify-center items-center aspect-square">
					<PlusIcon />
				</Button>
				<Button onClick={handleEdit} className="p-1 rounded-full h-full flex justify-center items-center aspect-square">
					<Pencil />
				</Button>
				</div>
			</div>
			<div className="
				col-span-12
				row-span-7
				flex flex-col
			">
				<h1 className="text-2xl font-bold">Planned Transactions</h1>
				<Transactions transactions={plannedTransactions} planned="yes" />
			</div>
		</div>
	)
}
