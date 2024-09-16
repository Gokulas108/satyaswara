"use client";

import Link from "next/link";
import { Download, HelpCircle, ShieldX } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

import darklogo from "../../../../public/landing/assets/images/vlogodark.png";
import logo from "../../../../public/landing/assets/images/vlogo.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = ({ data, classes, enrolled }: any) => {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const supabase = createClient();
	const [mainClass, setMainClass] = useState<any>(null);
	const [MCType, setMCType] = useState<string | null>(null);

	useEffect(() => {
		let class_today = getTodaysClass(classes);
		if (class_today) {
			setMainClass(class_today);
			setMCType("today");
			console.log("hr");
		} else {
			setMainClass(getNextClass(classes));
			setMCType("upcoming");
			console.log("first");
		}
	}, [classes]);

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		router.push("/login");
	};

	const getNextClass = (classes: any) => {
		const today = new Date(); // Get today's date as a Date object

		// Filter for classes with future dates and sort them in ascending order
		const upcomingClasses = classes
			.filter((classObj: any) => new Date(classObj.date) > today)
			.sort(
				(a: any, b: any) =>
					new Date(a.date).getTime() - new Date(b.date).getTime()
			);

		// Return the first upcoming class, or null if no future classes
		return upcomingClasses.length > 0 ? upcomingClasses[0] : null;
	};

	const getTodaysClass = (classes: any) => {
		const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

		// Find the class that has today's date
		return classes.find((classObj: any) => classObj.date === today) || null;
	};

	const formatDate = (dateString: string) => {
		const [year, month, day] = dateString.split("-"); // Split the string by "-"
		return `${day}-${month}-${year}`; // Rearrange the format to DD-MM-YYYY
	};

	const openUrlInNewTab = (url: string) => {
		if (url && typeof url === "string") {
			window.open(url, "_blank"); // Open the URL in a new tab
		} else {
			console.error("Invalid URL");
		}
	};

	return (
		<div className="flex min-h-screen w-full flex-col">
			<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
				<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
					<Link
						href="#"
						className="flex items-center gap-2 text-lg font-semibold md:text-base"
					>
						{/* <Package2 className="h-6 w-6" /> */}
						<Image
							src={theme === "dark" ? darklogo : logo}
							priority
							alt="Picture of the author"
							height={60}
						/>
						<span className="sr-only">Satyaswara</span>
					</Link>
				</nav>
				<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
					<div className="ml-auto flex-1 sm:flex-initial">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="secondary">
									{data.user.email}
									<span className="sr-only">Toggle user menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => {
										setTheme(theme === "dark" ? "light" : "dark");
									}}
								>
									Change Theme
								</DropdownMenuItem>
								<DropdownMenuItem>Support</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>
			<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{enrolled === "assigned" && classes ? (
					<>
						<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
							<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
								<Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
									{mainClass ? (
										MCType === "today" ? (
											<>
												<CardHeader className="pb-3">
													<CardDescription className="max-w-lg text-balance leading-relaxed">
														Today&apos;s Class
													</CardDescription>
													<CardTitle className="text-4xl">
														Week {mainClass.week_no}: {mainClass.topic}
													</CardTitle>
													<CardDescription className="max-w-lg text-balance leading-relaxed">
														{mainClass.batch} Batch&nbsp;&nbsp;|&nbsp;&nbsp;
														{mainClass.time}
													</CardDescription>
												</CardHeader>
												<CardFooter>
													<Button
														onClick={() => {
															openUrlInNewTab(mainClass.class_link);
														}}
													>
														Join Class
													</Button>
												</CardFooter>
											</>
										) : (
											<>
												<CardHeader className="pb-3">
													<CardDescription className="max-w-lg text-balance leading-relaxed">
														Upcoming Class
													</CardDescription>
													<CardTitle className="text-4xl">
														Week {mainClass.week_no}: {mainClass.topic}
													</CardTitle>

													<CardDescription className="max-w-lg text-balance leading-relaxed">
														{mainClass.batch} Batch&nbsp;&nbsp;|&nbsp;&nbsp;
														{formatDate(mainClass.date)}
														&nbsp;&nbsp;|&nbsp;&nbsp;
														{mainClass.time}
													</CardDescription>
												</CardHeader>
											</>
										)
									) : (
										<>
											<CardHeader className="pb-3">
												<CardDescription className="max-w-lg text-lg text-balance leading-relaxed">
													No Further Class Scheduled..
												</CardDescription>
											</CardHeader>
										</>
									)}
								</Card>
								<Card x-chunk="dashboard-05-chunk-1">
									<CardHeader>
										<div className="flex flex-col">
											<CardTitle>Materials for today</CardTitle>
											{MCType === "today" ? (
												<Button
													variant="outline"
													size={"sm"}
													className="text-sm w-full my-4"
													onClick={() =>
														openUrlInNewTab(mainClass.material_link)
													}
												>
													Download
													<Download className="ml-2 h-4 w-4" />
												</Button>
											) : (
												<CardDescription className="mt-6">
													No Class Today
												</CardDescription>
											)}
										</div>
									</CardHeader>
								</Card>
								<Card x-chunk="dashboard-05-chunk-2">
									<CardHeader>
										<CardTitle>Your Attendance</CardTitle>
										<div className="flex flex-wrap justify-between px-4 py-2">
											<span className="px-4 text-base">0/0 Classes</span>
											<Progress value={0 * 100} className="" />
										</div>
									</CardHeader>
								</Card>
							</div>

							<Card x-chunk="dashboard-05-chunk-3">
								<CardHeader className="px-7">
									<CardTitle>Classes</CardTitle>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Topic</TableHead>
												<TableHead className="hidden md:table-cell">
													Attendance
												</TableHead>
												<TableHead className="hidden sm:table-cell">
													Date
												</TableHead>
												<TableHead>Materials</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{classes.map((cls: any, idx: number) => (
												<TableRow key={idx}>
													<TableCell>
														<div>Week {cls.week_no}</div>
														<div className="font-bold">{cls.topic}</div>
													</TableCell>
													<TableCell className="hidden md:table-cell">
														<Badge className="text-xs" variant="secondary">
															Yet to Mark
														</Badge>
													</TableCell>
													<TableCell className="hidden sm:table-cell">
														{formatDate(cls.date)}
													</TableCell>
													<TableCell>
														<Button
															onClick={() => openUrlInNewTab(cls.material_link)}
															variant="outline"
															size={"sm"}
														>
															Download
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>
						<div>
							<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
								<CardHeader className="flex flex-row items-start bg-muted/50">
									<CardTitle className="group flex items-center gap-2 text-lg">
										Fees
									</CardTitle>
								</CardHeader>
								<CardContent className="p-6 text-sm">
									<div className="grid gap-3">
										<div className="font-semibold">No Pending Fees</div>
									</div>
								</CardContent>
								<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
									<div className="text-xs text-muted-foreground">
										Updated on{" "}
										<time dateTime="2024-09-13">September 13, 2024</time>
									</div>
								</CardFooter>
							</Card>
						</div>
					</>
				) : (
					<Alert className="col-span-full">
						<ShieldX className="h-4 w-4" />
						<AlertTitle>
							You have not been assigned any class or batch!
						</AlertTitle>
						<AlertDescription>
							<p className="text-gray-600">
								If you believe this is an error, please reach out to the
								instructor or email us at{" "}
								<span className="font-semibold underline">
									me@satyaswara.com
								</span>
								. If you have recently registered, kindly allow 1-2 days for
								processing.
							</p>
						</AlertDescription>
					</Alert>
				)}
			</main>
		</div>
	);
};

export default Dashboard;
