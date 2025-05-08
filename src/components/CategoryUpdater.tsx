import { ICategory } from "@/lib/types";
import { Card, CardTitle } from "./ui/card";
import { useAppContext } from "./AppContext";
import { getNodeFromId, getParentNode, handleTransactionParentDeleted } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { collection, deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { TurtleIcon } from "lucide-react";


export default function CategoryUpdater({ catId }: { catId: string }) {
	const { auth, transactions, categories, rootCategory } = useAppContext();
	const category = getNodeFromId(catId, rootCategory);

	const [name, setName] = useState<string>(category.name);
	const [color, setColor] = useState<string>(category.color);
	const [maxSpend, setMaxSpend] = useState<number>(categories.find(cat => cat.categoryId === category.parentId)?.maxSpend || category.maxSpend);

	const handleSubmit = () => {
		if (!name || !color || !maxSpend) {
			alert("Please fill in all fields");
			return;
		}
		if (!auth.currentUser) {
			alert("User has to be logged in!!");
			return;
		}

		const db = getFirestore(app);
		const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "categories");
		const docRef = doc(collRef, category.categoryId)
		setDoc(docRef, {
			name: name,
			color: color,
			maxSpend: maxSpend
		}, { merge: true })
		.then(() => {
			alert("Updated category");
		})
		.catch((e) => {
			alert("Failed to update category");
		})
	}

	const handleDeleteCat = (deletedId: string) => {
		if (!auth.currentUser) {
			alert("Must be logged in to do this!!");
			return;
		}
		const db = getFirestore(app);
		const subCats = categories.filter(cat => cat.parentId === deletedId);
		for (const transaction of transactions) {
			if (subCats.find(cat => cat.categoryId === transaction.category)) {
				const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "transactions");
				const docRef = doc(collRef, transaction.transactionId);
				setDoc(docRef, {
					category: catId
				}, { merge: true })
				.then(() => {
					console.log("Transaction updated");
				})
				.catch((e) => {
					console.log(e);
				})
			}
		}

		const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "categories");
		const docRef = doc(collRef, deletedId);
		deleteDoc(docRef)
		.then(() => {
			console.log("Category deleted");
		})
		.catch((e) => {
			console.log(e);
		})

		for (const subCat of subCats) {
			const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "categories");
			const docRef = doc(collRef, subCat.categoryId);
			deleteDoc(docRef)
			.then(() => {
				console.log("Category deleted");
			})
			.catch((e) => {
				console.log(e);
			})
		}
	}

	useEffect(() => {
		setName(category.name);
		setColor(category.color);
		setMaxSpend(category.maxSpend);
	}, [category])

	return (
		<Card className="p-2 flex flex-col gap-2 w-full max-w-96">
			<Button onClick={handleSubmit}>Update Category: {category.name}</Button>
			{category.categoryId != "root" &&
			<div className="w-full flex flex-col gap-2">
			<Label>Category Name</Label>
			<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" type="text"/>
			<Label>Category Color</Label>
			<Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Category Color" type="color"/>
			<Label>Category Budget</Label>
			<Input
				min={0}
				max={categories.find(cat => cat.categoryId === category.parentId)?.maxSpend || category.maxSpend}
				value={maxSpend}
				onChange={(e) => setMaxSpend(parseInt(e.target.value))}
				placeholder="Category Limit" type="number"
			/>
			<Label>Subcategories</Label>
			</div>
			}
			{categories.map((cat) => {
				if (cat.parentId != category.categoryId) return;
				return (
					<div className="w-full flex flex-row justify-between">
						<h1>{cat.name}</h1>
						<Button key={cat.categoryId} onClick={() => handleDeleteCat(cat.categoryId)}>Delete</Button>
					</div>
				)
			})}
		</Card>
	)
}
