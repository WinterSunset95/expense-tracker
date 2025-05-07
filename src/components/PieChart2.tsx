import { Cell, Pie, PieChart, PieLabel, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "./AppContext";
import { ICategory, IPieData, ITransaction } from "@/lib/types";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { TurtleIcon } from "lucide-react";
import { CategoricalChartState } from "recharts/types/chart/types";
import { Button } from "./ui/button";
import { generateColor } from "@/lib/helpers";

export default function PieChart2({ rootCategory, handleClick, handleBack }: { rootCategory: ICategory, handleClick: (e: any) => void, handleBack: (cat: ICategory) => void }) {
	const { balance, income, expense, transactions, plannedTransactions } = useAppContext();
	
	const [data, setData] = useState<IPieData[]>([]);

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

		for (let i=0; i<plannedTransactions.length; i++) {
			if (plannedTransactions[i].category === category.categoryId) {
				aggregate += plannedTransactions[i].amount > 0 ? 0 : -(plannedTransactions[i].amount);
			}
		}

		return aggregate;
	}

	useEffect(() => {
		let thisData: IPieData[] = [];

		if (!rootCategory) {
			setData([{
				id: "unknown",
				name: "unknown",
				value: 100,
				color: "#8884d8"
			}]);
			return;
		}

		let total = 0;

		for (const child in rootCategory.children) {
			const thisChild = rootCategory.children[child];
			if (thisChild.categoryId == "income") continue;
			thisData.push({
				id: thisChild.categoryId,
				name: child,
				value: thisChild.maxSpend,
				color: thisChild.color
			});
			total += thisChild.maxSpend;
		}

		for (let i=0; i<plannedTransactions.length; i++) {
			if (plannedTransactions[i].category === rootCategory.categoryId) {
				const newCol = generateColor(rootCategory.color as string, plannedTransactions[i].transactionId);
				thisData.push({
					id: plannedTransactions[i].description,
					name: plannedTransactions[i].description,
					value: plannedTransactions[i].amount > 0 ? 0 : -(plannedTransactions[i].amount),
					color: newCol,
				});
				total += plannedTransactions[i].amount > 0 ? 0 : -(plannedTransactions[i].amount);
			}
		}

		thisData.push({
			id: "Buffer",
			name: "buffer",
			value: rootCategory.maxSpend - total,
			color: "#8884d8"
		});

		setData(thisData);
	}, [rootCategory]);

	return (
		<div className="w-full h-full relative text-primary-foreground">
			<div className="
				absolute
				top-1/2
				left-1/2
				translate-x-[-50%]
				translate-y-[-50%]
				z-50
				flex
				justify-center
				items-center
				flex-col
			">
				<h2 className="
					text-2xl
				">{rootCategory.categoryId == "root" ? "Total Income" : rootCategory.name}</h2>
				<h1 className="
					text-4xl
					font-bold
				">{rootCategory.maxSpend}</h1>
			</div>
			<ResponsiveContainer width={"100%"} height={"100%"}>
				<PieChart width={500} height={500} className="w-full h-full">
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
						innerRadius="80%"
						fill="#8884d8"
						labelLine={false}
						animationEasing="ease-in-out"
						animationDuration={500}
						animationBegin={0}
					>
						{data.map((entry, index) => {
							return (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" />
							)
						})}
					</Pie>
					<Pie
						onClick={() => handleBack(rootCategory)}
						data={[{name: "Total Income", value: income}]}
						dataKey="value"
						nameKey="name"
						width="100%"
						height="100%"
						cx="50%"
						cy="50%"
						outerRadius="70%"
						labelLine={false}
						animationBegin={0}
						animationDuration={0}
					>
						<Cell stroke="" fill="#a0a0a0" />
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
