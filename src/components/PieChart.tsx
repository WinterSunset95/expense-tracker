import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { useAppContext } from "./AppContext";
import { ICategory, ITransaction } from "@/lib/types";
import { useEffect, useState } from "react";

export default function PieChartComponent({ transactions }: { transactions: ITransaction[] }) {
	const appcontext = useAppContext();

	if (!appcontext) {
		return (
			<div>Loading</div>
		);
	}

	const rootCategory = appcontext.rootCategories;

	const [data, setData] = useState([
		{
			name: "Groceries",
			value: 100 
		},
		{
			name: "Rent",
			value: 100
		}
	]);

	const getAggregateOfCategory = (category: ICategory): number => {
		let aggregate = 0;
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

	const setPieData = (category: ICategory) => {
		let thisData = [];
		for (const child in category.children) {
			thisData.push({
				name: child,
				value: getAggregateOfCategory(category.children[child])
			});
		}
		setData(thisData);
	}

	useEffect(() => {
		const savings = getAggregateOfCategory(rootCategory["savings"]);
		const needs = getAggregateOfCategory(rootCategory["needs"]);
		const wants = getAggregateOfCategory(rootCategory["wants"]);
		console.log(needs, wants, savings);
		console.log(needs + wants + savings);
		setPieData({
			categoryId: "root",
			name: "Root",
			icon: "https://picsum.photos/seed/root/200",
			children: {
				"needs": rootCategory["needs"],
				"wants": rootCategory["wants"],
				"savings": rootCategory["savings"]
			}
		});
	}, [])

	return (
		<ResponsiveContainer className={"w-full h-full"}>
			<PieChart width={500} height={500} className="w-full h-full">
				<Pie data={data} dataKey="value" nameKey="name" width="100%" height="100%" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8" label />
			</PieChart>
		</ResponsiveContainer>
	)
}
