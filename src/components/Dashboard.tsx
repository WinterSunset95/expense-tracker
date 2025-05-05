'use client';
import { Circle, CircleDot, House } from "lucide-react";
import TotalBal from "./TotalBal";
import Money from "./Money";
import Transactions from "./Transactions";
import { mockTransactionList } from "@/lib/mock";
import  useEmblaCarousel from "embla-carousel-react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import PieChartComponent from "./PieChart";
import { useAppContext } from "./AppContext";
import { Button } from "./ui/button";
import { Drawer } from "./Drawer";
import UpdateTransaction from "./UpdateTransaction";
import { ITransaction } from "@/lib/types";
import { useDashboardContext } from "./DashboardContext";

export default function Dashboard() {

	const appContext = useAppContext();
	const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);
	const { updaterRef } = useDashboardContext();

	useEffect(() => {
		if (!carouselApi) {
			return;
		}

		setCurrent(carouselApi.selectedScrollSnap());

		carouselApi.on("select", (index) => {
			setCurrent(carouselApi.selectedScrollSnap());
		});
	}, [carouselApi]);

	if (!appContext) {
		return (
			<div>Loading . . .</div>
		)
	}

	const transactions = appContext.transactions;
	const balance = appContext.balance;
	const income = appContext.income;
	const expense = appContext.expense;

	return (
		<main className="
				w-full
				h-full
				flex
				flex-col
				justify-center
				items-center
				gap-2
		">

			<div className="
				flex
				flex-row
				w-full
				gap-2
			">
				<TotalBal balance={balance} />
				<div className="flex
					flex-col
					lg:flex-row
					gap-2
					w-full
				">
					<Money amount={income} income="yes" />
					<Money amount={expense} income="no" />
				</div>
			</div>

			<Carousel className="
				w-full
				h-full
				flex-1
				overflow-auto
				flex
				flex-col
				gap-2
				lg:hidden
			" setApi={setCarouselApi}>

				<CarouselContent className="h-full">
					<CarouselItem className="overflow-auto">
						<div className="w-full h-full flex-1 overflow-auto">
							<Transactions transactions={transactions} />
						</div>
					</CarouselItem>
					<CarouselItem className="overflow-auto">
						<div className="w-full h-full flex-1 overflow-auto">
							<Transactions transactions={transactions} />
						</div>
					</CarouselItem>
					<CarouselItem className="overflow-auto">
						<div className="w-full h-full flex-1 overflow-auto">
							<PieChartComponent transactions={transactions} />
						</div>
					</CarouselItem>
				</CarouselContent>
				<div className="w-full flex flex-row justify-center items-center gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<div key={index} className={`w-2 h-2 rounded-full ${current === index ? "bg-black" : "bg-gray-400"}`}></div>
					))}
				</div>
			</Carousel>

			<div className="w-full h-full hidden lg:flex flex-row gap-2 flex-1 overflow-auto">
				<div className="grow flex flex-col flex-1 overflow-auto">
					<Tabs defaultValue="usage" className="w-full flex-1 overflow-auto">
						<div className="flex flex-row justify-between items-center">
							<h1 className="font-bold text-lg">Spending chart</h1>
							<TabsList>
								<TabsTrigger value="usage">Usage</TabsTrigger>
								<TabsTrigger value="planning">Planning</TabsTrigger>
							</TabsList>
						</div>
						<TabsContent value="usage" className="w-full flex-1 overflow-auto">
							<PieChartComponent transactions={transactions} />
						</TabsContent>
						<TabsContent value="planning" className="w-full flex-1 overflow-auto">
							<Transactions transactions={transactions} />
						</TabsContent>
					</Tabs>
				</div>
				<div className="grow max-w-1/3 flex flex-col flex-1 overflow-auto">
					<h1 className="py-2 font-bold text-lg">History</h1>
					<div className="w-full h-full flex-1 overflow-auto">
						<Transactions transactions={transactions} />
					</div>
				</div>
			</div>

		</main>
	)
}
