'use client';
import { Circle, CircleDot, House } from "lucide-react";
import TotalBal from "./TotalBal";
import Money from "./Money";
import Transactions from "./Transactions";
import { mockTransactionList } from "@/lib/mock";
import  useEmblaCarousel from "embla-carousel-react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import { useEffect, useState } from "react";

export default function Dashboard() {

	const transactions = mockTransactionList();
	const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!carouselApi) {
			return;
		}

		setCurrent(carouselApi.selectedScrollSnap());

		carouselApi.on("select", (index) => {
			setCurrent(carouselApi.selectedScrollSnap());
		});

	}, [carouselApi]);

	useEffect(() => {
		console.log(current);
	}, [current]);

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
				<TotalBal balance={22000} />
				<div className="flex
					flex-col
					lg:flex-row
					gap-2
					w-full
				">
					<Money amount={19000} income="yes" />
					<Money amount={25000} income="no" />
				</div>
			</div>

			<Carousel className="w-full h-full flex-1 overflow-auto flex flex-col gap-2" setApi={setCarouselApi}>
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
							<Transactions transactions={transactions} />
						</div>
					</CarouselItem>
				</CarouselContent>
				<div className="w-full flex flex-row justify-center items-center gap-2">
					{Array.from({ length: 3 }).map((_, index) => (
						<div className={`w-2 h-2 rounded-full ${current === index ? "bg-black" : "bg-gray-400"}`}></div>
					))}
				</div>
			</Carousel>

		</main>
	)
}
