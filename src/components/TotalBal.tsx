import { Card, CardContent, CardTitle } from "./ui/card";


export default function TotalBal({ balance, currency }: { balance: number, currency?: string }) {
	return (
		<Card className="w-full h-full">
			<CardContent className="
				w-full
				h-full
				flex
				flex-col
				justify-center
			"
			>
				<h1 className="text-lg">Total Balance</h1>
				<span className="
					text-3xl
					lg:text-4xl
				">
					{balance} {currency ?? "INR"}
				</span>
			</CardContent>
		</Card>
	)
}
