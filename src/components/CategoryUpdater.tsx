import { ICategory } from "@/lib/types";
import { Card, CardTitle } from "./ui/card";
import { useAppContext } from "./AppContext";
import { getNodeFromId, getParentNode, handleTransactionParentDeleted } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";


export default function CategoryUpdater({ category }: { category: ICategory }) {

	const [name, setName] = useState<string>(category.name);
	const [color, setColor] = useState<string>(category.color);
	const [maxSpend, setMaxSpend] = useState<number>(category.maxSpend);
	const [deletedSubcats, setDeletedSubcats] = useState<ICategory[]>([]);
	const { transactions, categories } = useAppContext();

	const handleSubmit = () => {
	}

	const handleDeleteCat = () => {
	}

	return (
		<Card className="p-2 flex flex-col gap-2">
			<Button>Update Category: {category.name}</Button>
			<Input placeholder="Category Name" />
			<Input placeholder="Category Color" />
			<Input placeholder="Category Limit" />
			{categories.map((cat) => {
				if (cat.parentId != category.categoryId) return;
				return (
					<Button key={cat.categoryId} onClick={() => handleDeleteCat()}>Delete {cat.name}</Button>
				)
			})}
		</Card>
	)
}
