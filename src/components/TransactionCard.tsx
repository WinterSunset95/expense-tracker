import { ITransaction } from "@/lib/types";
import { Card } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function TransactionCard({ transaction }: { transaction: ITransaction }) {

	return (
		<Card className="w-full flex flex-col p-2">
			<Collapsible>
				<CollapsibleTrigger className="w-full flex flex-row justify-center items-center gap-2 pr-4">
					<Avatar>
						<AvatarImage src={`https://picsum.photos/seed/${transaction.description}/200`} />
					</Avatar>
					<div className="flex flex-col items-start grow">
						<h1 className="text-lg">{transaction.description}</h1>
						<h1>{new Date(transaction.date).toDateString()}</h1>
					</div>
					<div className="flex flex-col">
						<h1 className={`${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>{transaction.amount}</h1>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div>
						<h1 className="text-lg">Category:</h1>
						<h1>{transaction.category}</h1>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}
