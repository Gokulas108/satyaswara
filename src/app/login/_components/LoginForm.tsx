"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { SunDim, MoonStars, SpinnerGap } from "@phosphor-icons/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import darklogo from "../../../../public/landing/assets/images/vlogodark.png";
import logo from "../../../../public/landing/assets/images/vlogo.png";

const LoginForm = () => {
	const { theme, setTheme } = useTheme();
	const supabase = createClient();
	const router = useRouter();

	const [error, setError] = useState("");
	const [autoSigning, setAutoSigning] = useState(false);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session) {
				setAutoSigning(true);
				setTimeout(() => {
					// If login is successful, redirect to dashboard
					router.push("/dashboard");
				}, 1500);
			}
		});

		// Cleanup the subscription on component unmount
		return () => {
			subscription?.unsubscribe();
		};
	}, [router]);

	// const getURL = () => {
	// 	let url =
	// 		process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
	// 		"http://localhost:3000/";
	// 	// Make sure to include `https://` when not localhost.
	// 	url = url.startsWith("http") ? url : `https://${url}`;
	// 	// Make sure to include a trailing `/`.
	// 	url = url.endsWith("/") ? `${url}dashboard` : `${url}/dashboard`;
	// 	return url;
	// };

	const ModeToggle = () => {
		return (
			<Button
				variant="outline"
				size="icon"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			>
				{theme === "dark" ? <SunDim size={30} /> : <MoonStars size={30} />}
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	};

	const handleGoogleLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				// redirectTo: "http://localhost:3000/dashboard",
				redirectTo: "https://www.satyaswara.com/dashboard",
				queryParams: {
					prompt: "consent",
					access_type: "offline",
				},
			},
		});

		if (error) {
			setError("Google login failed. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="absolute top-2 right-4">
				<ModeToggle />
			</div>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<div className="flex justify-center py-6">
						<Image
							src={theme === "dark" ? darklogo : logo}
							alt="Picture of the author"
							height={60}
							priority
						/>
					</div>
					<CardDescription className="text-center">
						Login to Satyaswara with your registered Gmail Account.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{error && <Alert>{error}</Alert>}
					{/* <LoginForm loginAction={loginAction} /> */}
					<Button disabled={autoSigning} onClick={handleGoogleLogin}>
						{autoSigning ? (
							<>
								<span className="pr-2">Signing you In</span>
								<SpinnerGap className="animate-spin" size={22} />
							</>
						) : (
							"Login with Google"
						)}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
