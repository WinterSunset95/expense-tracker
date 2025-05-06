import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useDrawerContext } from "./Drawer";
import { useDashboardContext } from "./DashboardContext";
import UpdateTransaction from "./UpdateTransaction";
import { set } from "date-fns";


export default function Money({ amount, income, currency }: { amount: number, income: 'yes' | 'no', currency?: string }) {
	const { open, close, setChild } = useDrawerContext();

	return (
		<Card className="w-full h-full cursor-pointer"
		onClick={() => {
			setChild(<UpdateTransaction transaction={undefined} mode={income === 'yes' ? 'income' : 'expense'} />);
			open();
		}}>
			<CardContent className="
				w-full h-full
				flex
				flex-col
				justify-center
				items-start
				">
				<h1 className="">
				{
					income === 'yes' ?
						"Income"
					:
						"Expense"
				}
				</h1>
				<h1 className={`
					text-xl
					md:text-2xl
					${income === 'yes' ? 'text-green-600' : 'text-red-600'}
				`}>
						{amount} {currency ?? 'INR'}
				</h1>
			</CardContent>
		</Card>
	)
}
