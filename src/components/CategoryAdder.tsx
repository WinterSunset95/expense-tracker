import { ICategory, ICategoryFlat } from "@/lib/types";
import { Card, CardTitle } from "./ui/card";
import { useAppContext } from "./AppContext";
import { getNodeFromId, getParentNode } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

/*
* Adds a subcategory to the selected category
* @param cat - the category to add a subcategory to
*/
export default function CategoryAdder({ cat }: { cat: ICategory }) {

	// the only thing that updates the rootCategory state is
	// a onSnapshot listener on the AppContext provider
	const { auth, categories, rootCategory } = useAppContext();

	const [text, setText] = useState<string>();
	const [color, setColor] = useState<string>();
	const [maxSpend, setMaxSpend] = useState<number>();
	const [upperLimit, setUpperLimit] = useState<number>(rootCategory.maxSpend);
	// Lets get an aggregate of the percentage spent in this category
	const updateUpperLimit = () => {
		let aggregate = 0;
		for (const child in cat.children) {
			if (child == "income") continue;
			aggregate += cat.children[child].maxSpend;
		}
		setUpperLimit(cat.maxSpend - aggregate);
		setMaxSpend(cat.maxSpend - aggregate);
	}
	const handleClick = () => {
		if (!text || !color || !maxSpend) {
			alert("Please fill in all fields");
			return
		}
		if (!auth.currentUser) {
			alert("Must be logged in to use this feature!!");
			return
		}
		// Generate a new id: all special characters are changed to "-"
		const newId = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
		// check if the categoryId or name already exists
		if (categories.find(cat => cat.categoryId === newId) || categories.find(cat => cat.name === text)) {
			alert("Category already exists");
			return
		}
		// If we reach this part of the code, we are good to go
		const toUpload: ICategoryFlat = {
			categoryId: newId,
			name: text,
			icon: "https://picsum.photos/seed/" + newId + "/200",
			color: color,
			maxSpend: maxSpend,
			parentId: cat.categoryId
		}
		const db = getFirestore();
		const collRef = collection(db, "tenants", auth.tenantId as string, "users", auth.currentUser.uid, "categories");
		const docRef = doc(collRef, newId);
		setDoc(docRef, toUpload)
		.then(() => {
			alert("Successfully added subcategory");
		})
		.catch((e) => {
			alert("Failed to add subcategory");
		})
	}

	useEffect(() => {
		updateUpperLimit();
	}, [])

	useEffect(() => {
		setText(cat.name);
		setColor(cat.color);
		setMaxSpend(cat.maxSpend);
		updateUpperLimit();
	}, [cat])

	return (
		<Card className="p-2 flex flex-col gap-2">
			<Button onClick={handleClick}>{cat.categoryId == "root" ? "Create new category" : "Add subcategory to: \"" + cat.name + "\"" }</Button>
			<div className="w-full flex flex-col gap-2 justify-center">
				<Label>Name</Label>
				<Input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Category name" />
			</div>
			<div className="w-full flex flex-col gap-2 justify-center">
				<Label>Color</Label>
				<Input value={color} onChange={(e) => setColor(e.target.value)} type="color" placeholder="Color" />
			</div>
			<div className="w-full flex flex-col gap-2 justify-center">
				<Label>Budget</Label>
				<Input value={maxSpend} onChange={(e) => setMaxSpend(parseInt(e.target.value))} type="number" min={0} max={upperLimit} placeholder="Max Spending Budget" />
			</div>
		</Card>
	)
}
