import { Cell, Pie, PieChart, PieLabel, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "./AppContext";
import { ICategory, ITransaction } from "@/lib/types";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { TurtleIcon } from "lucide-react";
import { CategoricalChartState } from "recharts/types/chart/types";

export default function PieChartComponent({ transactions }: { transactions: ITransaction[] }) {
	const { rootCategories, income, expense } = useAppContext();
	const [data, setData] = useState<{ name: string, value: number }[]>([]);
	const [currRootCategory, setCurrRootCategory] = useState<Record<string, ICategory>>(rootCategories);

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
			const aggregate = getAggregateOfCategory(category[key]);
			if (aggregate === 0) {
				return;
			}
			thisData.push({
				name: key,
				value: getAggregateOfCategory(category[key])
			});
		});

		setData(thisData);
	}

	useEffect(() => {
		setPieData(currRootCategory);
	}, [income, expense])

	if (expense == 0) {
		return (
			<div className="w-full h-full flex justify-center items-center flex-col">
				<TurtleIcon size={128} />
				<h1 className="text-2xl md:text-4xl font-bold">Wow, such empty</h1>
			</div>
		)
	}

	const handleClick = (e: any) => {
		console.log(e);
		console.log(data);
	}

	const customizedLabel = (props: any): ReactNode | ReactElement<SVGElement, string | JSXElementConstructor<any>> => {
		const RADIAN = Math.PI / 180;
		const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		
		return (
			<text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
				{`${(props.percent * 100).toFixed(0)}%`}
			</text>
		)
	}

	return (
		<ResponsiveContainer className={"w-full h-full"}>
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
					outerRadius="80%"
					fill="#8884d8"
					label={customizedLabel}
					labelLine={false}
				>
					{data.map((entry, index) => {
						const color = rootCategories[entry.name].color ?? "#8884d8";
						return (
							<Cell key={`cell-${index}`} fill={color} />
						)
					})}
				</Pie>
				<Tooltip cursor={true} />
			</PieChart>
		</ResponsiveContainer>
	)
}
