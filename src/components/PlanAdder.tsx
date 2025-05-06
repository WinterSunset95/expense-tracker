import { ICategory } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import UpdateTransaction from "./UpdateTransaction";
import { Card, CardTitle } from "./ui/card";

export default function PlanAdder({ category }: { category: ICategory }) {

	return (
		<Tabs defaultValue="category">
			<TabsList>
				<TabsTrigger value="category">Add Category</TabsTrigger>
				<TabsTrigger value="transaction">Planned Transaction</TabsTrigger>
			</TabsList>

			<TabsContent value="category">
				<Card>
					<CardTitle>Hello there</CardTitle>
				</Card>
			</TabsContent>

			<TabsContent value="transaction">
				<UpdateTransaction transaction={undefined} mode="planned-expense" />
			</TabsContent>

		</Tabs>
	)
}
