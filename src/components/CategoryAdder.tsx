import { ICategory } from "@/lib/types";
import { Card, CardTitle } from "./ui/card";
import { useAppContext } from "./AppContext";
import { getNodeFromId, getParentNode } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

export default function CategoryAdder({ cat }: { cat: ICategory }) {

	// the only thing that updates the rootCategory state is
	// a onSnapshot listener on the AppContext provider
	const { auth, rootCategory } = useAppContext();

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
	}

	useEffect(() => {
		updateUpperLimit();
	}, [])

	useEffect(() => {
		console.log(color);
	}, [color])

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
