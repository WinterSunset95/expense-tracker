'use client'
import { ICategories, ICurrencies, ITransaction } from "@/lib/types";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useAppContext } from "./AppContext";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useDrawerContext } from "./Drawer";

export type UpdaterHandle = {
	setTransaction: (transaction: ITransaction | null) => void
	setMode: (mode: "income" | "expense" | "expense-update" | "income-update") => void
	open: () => void
	close: () => void
};

// This component exposes an api of type UpdaterHandle
const UpdateTransaction = forwardRef<UpdaterHandle>((props, ref) => {
	const [transaction, setTransaction] = useState<ITransaction | null>(null);

	const { open: openDrawer, close: closeDrawer } = useDrawerContext();

	const [amount, setAmount] = useState<number>(0);
	const [description, setDescription] = useState<string>("");
	const [paymentMethod, setPaymentMethod] = useState<string>("");
	const [currency, setCurrency] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date());
	const { rootCategory } = useAppContext();
	const [mode, setMode] = useState< "income" | "expense" | "expense-update" | "income-update" >("expense");

	useImperativeHandle(ref, () => ({
		setTransaction: (transaction: ITransaction | null) => {
			setTransaction(transaction);
		},
		setMode: (mode: "income" | "expense" | "expense-update" | "income-update" ) => {
			setMode(mode);
		},
		open: () => {
			openDrawer();
		},
		close: () => {
			closeDrawer();
		}
	}));

	const { auth } = useAppContext();
	const db = getFirestore(app);

	if (auth.currentUser == null) return <div>Loading...</div>

	const submit = () => {
		if (auth.currentUser == null) return <div>Loading...</div>

		if (!amount || !description || !currency || !category || !date) {
			alert("Please fill all the fields!!");
			return;
		}

		const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "transactions");
		let toUpload: ITransaction;
		if (!transaction || transaction.transactionId == "") {
			// We generate a new transaction
			const newDocRef = doc(collRef);
			toUpload = {
				transactionId: newDocRef.id,
				amount: mode.includes("income") ? amount : -amount,
				currency: currency,
				date: date,
				category: category,
				description: description,
				paymentMethod: paymentMethod ?? "Not specified",
				isRecurring: false
			}
		} else {
			// We are updating the transaction
			toUpload = {
				transactionId: transaction.transactionId,
				amount: mode.includes("income") ? amount : -amount,
				currency: currency,
				date: date,
				category: category,
				description: description,
				paymentMethod: paymentMethod ?? transaction.paymentMethod,
				isRecurring: transaction.isRecurring,
			}
		}

		setDoc(doc(collRef, toUpload.transactionId), toUpload)
		.then(() => {
			// cleanup
			setAmount(0);
			setDescription("");
			setPaymentMethod("");
			setCurrency("");
			setCategory("");
			setDate(new Date());
		})
		.catch((error) => {
			console.log("Error writing document: ", error);
		})
	}

	useEffect(() => {
		console.log(transaction);
		if (transaction) {
			setAmount(transaction.amount > 0 ? transaction.amount : -transaction.amount);
			setDescription(transaction.description);
			setPaymentMethod(transaction.paymentMethod);
			setCurrency(transaction.currency);
			setCategory(transaction.category);
			setDate(transaction.date);
		}
	}, [transaction])

	return (
		<div className={`
			flex
			flex-col
			justify-end
			items-center
			w-full
			max-w-96
		`}>
			<Card className="w-full p-2 flex flex-col items-start gap-2 justify-center">
				{
					mode.includes("update") ? <Button onClick={submit}>Update</Button>
					: mode == "income" ? <Button onClick={submit} variant="secondary">Add Income</Button>
					: <Button onClick={submit} variant="destructive">Add Expense</Button>
				}
				<Input className="w-full" min={0} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} type="number" placeholder="Enter the amount *" required/>
				<Input className="w-full" value={description} onChange={(e) => setDescription(e.currentTarget.value)} type="text" placeholder="Description *" required/>
				<Input className="w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.currentTarget.value)} type="text" placeholder="Payment method" />
				<Select onValueChange={setCurrency} value={currency}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a currency *" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel> Currency </SelectLabel>
							{Object.keys(ICurrencies).map((currency) => (
								<SelectItem key={currency} className="w-full" value={currency}>{ICurrencies[currency].name}: {currency}</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select onValueChange={setCategory} value={mode.includes("income") ? "income" : category} disabled={mode.includes("income")}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Category</SelectLabel>
							{Object.keys(rootCategory.children).map((category) => {
								if (category == "income") {
									return
								}
								return (
									<SelectItem key={category} className="w-full" value={category}>{rootCategory.children[category].name}: {category}</SelectItem>
								)
							})}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Popover>
					<PopoverTrigger asChild>
						<Button className="w-full flex flex-row justify-start items-center" variant="outline">
							<CalendarIcon />
							{date ? date.toLocaleDateString() : "Select a date"}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<Calendar
							mode="default"
							selected={date}
							initialFocus
							onDayClick={(e) => {
								console.log(e.toLocaleDateString())
								setDate(e)
							}}
						/>
					</PopoverContent>
				</Popover>
			</Card>
		</div>
	)
})

export default UpdateTransaction
