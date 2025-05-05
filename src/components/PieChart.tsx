import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { useAppContext } from "./AppContext";
import { ICategory, ITransaction } from "@/lib/types";
import { useEffect, useState } from "react";
import { TurtleIcon } from "lucide-react";

export default function PieChartComponent({ transactions }: { transactions: ITransaction[] }) {
	const { rootCategories, income, expense } = useAppContext();
	const [data, setData] = useState<{ name: string, value: number }[]>([]);

	const getAggregateOfCategory = (category: ICategory): number => {
		console.log("Aggregating category: ", category.categoryId);
		let aggregate = 0;
		if (!category) {
			console.log("no category");
			return 0;
		}

		if (category.children) {
			for (const child in category.children) {
				console.log("Aggregating child: ", category.children[child]);
				aggregate += getAggregateOfCategory(category.children[child]);
			}
		}

		for (let i=0; i<transactions.length; i++) {
			console.log("Checking between: " + transactions[i].category + " and " + category.categoryId);
			if (transactions[i].category === category.categoryId) {
				aggregate += transactions[i].amount > 0 ? 0 : -(transactions[i].amount);
			}
		}

		return aggregate;
	}

	const setPieData = (category?: Record<string, ICategory>) => {
		let thisData: { name: string, value: number }[] = [];

		if (!category) {
			setData([{
				name: "unknown",
				value: 100
			}]);
			return;
		}

		Object.keys(category).forEach((key) => {
			thisData.push({
				name: key,
				value: getAggregateOfCategory(category[key])
			});
		});

		setData(thisData);
		console.log(thisData);
	}

	useEffect(() => {
		setPieData(rootCategories);
	}, [income, expense])

	if (expense == 0) {
		return (
			<div className="w-full h-full flex justify-center items-center flex-col">
				<TurtleIcon size={128} />
				<h1 className="text-2xl md:text-4xl font-bold">Wow, such empty</h1>
			</div>
		)
	}

	return (
		<ResponsiveContainer className={"w-full h-full"}>
			<PieChart width={500} height={500} className="w-full h-full">
				<Pie data={data} dataKey="value" nameKey="name" width="100%" height="100%" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8" label />
			</PieChart>
		</ResponsiveContainer>
	)
}
