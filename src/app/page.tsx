'use client'
import { useAppContext } from "@/components/AppContext";
import Dashboard from "@/components/Dashboard";
import { DashboardProvider } from "@/components/DashboardContext";
import { DrawerProvider } from "@/components/Drawer";
import Onboarding from "@/components/Onboarding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeIcon, House, PieChart, PieChartIcon, PiggyBankIcon, User2 } from "lucide-react";

export default function Home() {

	const appContext = useAppContext();

	if (!appContext.auth.currentUser) {
		return (
			<Onboarding />
		)
	}

  return (
    <Tabs defaultValue="home" className="w-full h-full flex flex-col-reverse lg:flex-row p-2">
		<TabsList className="w-full lg:w-1/5 lg:h-full flex flex-row lg:flex-col lg:justify-start lg:items-start lg:p-3">
			<div className="hidden lg:flex w-full aspect-square p-4">
				<div className="w-full h-full rounded-full border border-black flex justify-center items-center overflow-hidden">
					<img src="https://picsum.photos/seed/wallace/200" className="w-full h-full object-cover" />
				</div>
			</div>
			<TabsTrigger value="home" className="lg:w-full lg:grow-0 lg:justify-start md:text-lg lg:text-xl lg:p-2">
				<House className="w-6! h-6! md:w-8! md:h-8!" />
				<h1 className="hidden md:block">Dashboard</h1>
			</TabsTrigger>
			<TabsTrigger value="planning" className="lg:w-full lg:grow-0 lg:justify-start md:text-lg lg:text-xl lg:p-2">
				<PieChart className="w-6! h-6! md:w-8! md:h-8!"  size={128} />
				<h1 className="hidden md:block">Planning</h1>
			</TabsTrigger>
			<TabsTrigger value="savings" className="lg:w-full lg:grow-0 lg:justify-start md:text-lg lg:text-xl lg:p-2">
				<PiggyBankIcon className="w-6! h-6! md:w-8! md:h-8!"  />
				<h1 className="hidden md:block">Savings</h1>
			</TabsTrigger>
			<TabsTrigger value="profile" className="lg:w-full lg:grow-0 lg:justify-start md:text-lg lg:text-xl lg:p-2">
				<User2 className="w-6! h-6! md:w-8! md:h-8!"  />
				<h1 className="hidden md:block">Profile</h1>
			</TabsTrigger>
		</TabsList>

		<TabsContent value="home" className="overflow-auto">
			<DrawerProvider>
				<DashboardProvider>
					<Dashboard />
				</DashboardProvider>
			</DrawerProvider>
		</TabsContent>
		<TabsContent value="planning" className="overflow-auto">
			<DrawerProvider>
				<DashboardProvider>
					<Dashboard />
				</DashboardProvider>
			</DrawerProvider>
		</TabsContent>
		<TabsContent value="savings" className="overflow-auto">
			<DrawerProvider>
				<DashboardProvider>
					<Dashboard />
				</DashboardProvider>
			</DrawerProvider>
		</TabsContent>
		<TabsContent value="profile" className="overflow-auto">
			<DrawerProvider>
				<DashboardProvider>
					<Dashboard />
				</DashboardProvider>
			</DrawerProvider>
		</TabsContent>
	</Tabs>
  );
}
