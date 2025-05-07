import { Cell, Pie, PieChart, PieLabel, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "./AppContext";
import { ICategory, ITransaction } from "@/lib/types";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { TurtleIcon } from "lucide-react";
import { CategoricalChartState } from "recharts/types/chart/types";
import { Button } from "./ui/button";
import { colorIsDark, generateColor, getParentNode } from "@/lib/helpers";

export default function PieChartComponent({ transactions }: { transactions: ITransaction[] }) {
	const { categories, income, expense, rootCategory } = useAppContext();
	const [data, setData] = useState<{ id: string, name: string, value: number, color: string }[]>([]);
	const [currRoot, setCurrRoot] = useState<ICategory>(rootCategory);

	const getAggregateOfCategory = (category: ICategory): number => {
		let aggregate = 0;
		if (!category) {
			console.log("no category");
			return 0;
		}

		if (category.children) {
			for (const child in category.children) {
				aggregate += getAggregateOfCategory(category.children[child]);
			}
		}

		for (let i=0; i<transactions.length; i++) {
			if (transactions[i].category === category.categoryId) {
				aggregate += transactions[i].amount > 0 ? 0 : -(transactions[i].amount);
			}
		}

		return aggregate;
	}

	const setPieData = (root?: ICategory) => {
		let thisData: { id: string, name: string, value: number, color: string }[] = [];

		if (!root) {
			setData([{
				id: "unknown",
				name: "unknown",
				value: 100,
				color: "#8884d8"
			}]);
			return;
		}

		const categories = root.children;

		Object.keys(categories).forEach((key) => {
			const aggregate = getAggregateOfCategory(categories[key]);
			if (aggregate === 0) {
				return;
			}
			thisData.push({
				id: key,
				name: categories[key].name,
				value: getAggregateOfCategory(categories[key]),
				color: categories[key].color ?? "#8884d8"
			});
		});

		transactions.forEach((transaction) => {
			if (transaction.category === root.categoryId) {
				thisData.push({
					id: transaction.transactionId,
					name: transaction.description,
					value: transaction.amount > 0 ? 0 : -(transaction.amount),
					color: generateColor(root.color ?? "#8884d8", transaction.description)
				});
			}
		})

		setData(thisData);
	}

	useEffect(() => {
		setPieData(currRoot);
	}, [income, expense, currRoot])

	if (expense == 0) {
		return (
			<div className="w-full h-full flex justify-center items-center flex-col">
				<TurtleIcon size={128} />
				<h1 className="text-2xl md:text-4xl font-bold">Wow, such empty</h1>
			</div>
		)
	}

	const handleClick = (e: any) => {
		const newRootCat = currRoot.children[e.id];
		if (!newRootCat) {
			alert("You can only expand a category!!");
			return;
		}
		setCurrRoot(newRootCat);
	}

	const handleBack = () => {
		setCurrRoot(getParentNode(currRoot, rootCategory));
	}

	if (data.length === 0) {
		return (
			<div className="w-full h-full flex justify-center items-center flex-col gap-2">
				<TurtleIcon size={128} />
				<h1 className="text-2xl md:text-4xl font-bold">Wow, such empty</h1>
			</div>
		)
	}

	return (
		<div className="w-full h-full flex justify-center items-center flex-col gap-2 relative">
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center">
				<h1 className="text-2xl">{currRoot.categoryId == "root" ? "Total" : currRoot.name}</h1>
				<h1 className="text-4xl font-black">{getAggregateOfCategory(currRoot)}</h1>
			</div>
			<div className="absolute bottom-0 left-0 -translate-y-12 w-full z-50 flex flex-row justify-center items-center flex-nowrap overflow-auto gap-2">
				{data.map((entry, index) => {
					const backgroundColor = generateColor(currRoot.color ?? "#8884d8", entry.name);
					let textColor = "text-white";
					if (colorIsDark(backgroundColor)) {
						textColor = "text-white"
					} else {
						textColor = "text-black"
					}
					return (
						<Button key={`pie-${index}`} onClick={() => { handleClick({ id: entry.id }) }}
							style={{ backgroundColor: currRoot.children[entry.id]?.color ?? backgroundColor }}
						>
							<h1 className={`
									${textColor}
								`}> {entry.name} </h1>
							<h1 className={` ${textColor} `} >{entry.value}</h1>
						</Button>
					)
				})}
			</div>
			<ResponsiveContainer width="100%" height="60%">
				<PieChart width={500} height={500} className="w-full h-full max-h-[70%]">
					<Pie
						onClick={handleClick}
						data={data}
						dataKey="value"
						nameKey="name"
						width="100%"
						height="100%"
						cx="50%"
						cy="50%"
						outerRadius="100%"
						innerRadius="70%"
						fill="#8884d8"
						labelLine={false}
						animationBegin={0}
						animationDuration={500}
						animationEasing="ease-in-out"
					>
						{data.map((entry, index) => {
							return (
								<Cell key={`cell-${index}`} stroke="#8884d8" fill={entry.color} />
							)
						})}
					</Pie>
					<Pie
						onClick={handleBack}
						data={[{ name: "Back", value: 100, color: getParentNode(currRoot, rootCategory).color}]}
						dataKey="value"
						nameKey="name"
						width="100%"
						height="100%"
						cx="50%"
						cy="50%"
						outerRadius="60%"
						fill="#8884d8"
						labelLine={false}
						animationBegin={0}
						animationDuration={500}
						animationEasing="ease-in-out"
					>
						<Cell stroke="" fill={currRoot.color} />
					</Pie>

				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
