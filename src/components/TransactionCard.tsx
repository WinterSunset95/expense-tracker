import { ITransaction } from "@/lib/types";
import { Card } from "./ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAppContext } from "./AppContext";
import { collection, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useDrawerContext } from "./Drawer";
import UpdateTransaction from "./UpdateTransaction";
import { getNodeFromId } from "@/lib/helpers";

export default function TransactionCard({ transaction }: { transaction: ITransaction }) {
	const { auth, rootCategory } = useAppContext();
	const db = getFirestore(app);
	const { open, setChild } = useDrawerContext();

	const updateItem = () => {
		setChild(<UpdateTransaction transaction={transaction} mode={transaction.amount > 0 ? "income-update" : "expense-update"}></UpdateTransaction>)
		open();
	}

	const deleteItem = () => {
		if (auth.currentUser == null) return;
		const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "transactions");
		const docRef = doc(collRef, transaction.transactionId);
		deleteDoc(docRef)
		.then(() => {
			console.log("Transaction deleted");
		})
		.catch((error) => {
			console.log(error);
		})
	}

	return (
		<Card className="w-full flex flex-col p-2 cursor-pointer">
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
				<CollapsibleContent className="mt-2">
					<div className="w-full h-full flex flex-col">
						<h1 className="">Category: {getNodeFromId(transaction.category, rootCategory).name}</h1>
						<h2>Paid through: {transaction.paymentMethod}</h2>
						<div className="w-full flex flex-row justify-end gap-2">
							<Button onClick={() => updateItem()}>Edit</Button>
							<Button onClick={() => deleteItem()} variant="destructive">Delete</Button>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}
