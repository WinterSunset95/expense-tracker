import { ITransaction } from "@/lib/types";
import TransactionCard from "./TransactionCard";

export default function Transactions({
	transactions
}: {
	transactions: ITransaction[]
}) {

	return (
		<div className="w-full h-full flex flex-col gap-2 overflow-auto">
			{transactions.map((transaction, index) => (
				<TransactionCard key={index} transaction={transaction} />
			))}
		</div>
	);
}
