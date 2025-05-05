import { ITransaction } from "@/lib/types";
import TransactionCard from "./TransactionCard";

export default function Transactions({
	transactions
}: {
	transactions: ITransaction[]
}) {

	if (transactions.length === 0) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center gap-2">
				<p className="text-gray-400 text-sm">No transactions found</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col gap-2 overflow-auto">
			{transactions.map((transaction, index) => (
				<TransactionCard key={index} transaction={transaction} />
			))}
		</div>
	);
}
