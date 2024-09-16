"use client";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Dashboard from "./_components/Dashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export const description =
	"An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

const DashboardPage = () => {
	const supabase = createClient();
	const [session, setSession] = useState<any>(null);
	const [enrolled, setEnrolled] = useState<string | null>(null);
	const [classes, setClasses] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		// Fetch the current session using getSession()
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error("Error getting session:", error);
				return;
			}

			if (data?.session?.user) {
				let user = data.session.user;
				const student = await supabase
					.from("students")
					.select("*")
					.eq("user_id", user.id); // Filter by authenticated user's UUID

				if (student.data && student.data.length > 0) {
					const classes = await supabase
						.from("classes")
						.select("*")
						.order("date", { ascending: false });
					console.log("classes : ", classes);

					if (classes.error) {
						console.error("Error fetching class details:", error);
					}
					setClasses(classes.data);
					setEnrolled("assigned");
				} else {
					setEnrolled("unassigned");
				}

				if (student.error) {
					console.error("Error fetching student details:", error);
				}
			}

			setSession(data.session);
			console.log("Data: ", data);

			// Redirect to login page if no session exists
			if (!data.session) {
				router.push("/login");
			}
		};

		getSession();

		// Subscribe to auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (!session) {
				router.push("/login");
			}
		});

		// Cleanup subscription when the component unmounts
		return () => {
			subscription?.unsubscribe();
		};
	}, [router]);

	return session && enrolled ? (
		<Dashboard data={session} enrolled={enrolled} classes={classes} />
	) : (
		<div className="flex items-center justify-center h-screen w-full">
			<Loader className="h-16 w-16 text-orange-600 animate-spin" />
		</div>
	);
};

export default DashboardPage;

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

// const Dashboard = () => {
//   const [session, setSession] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Get the current session
//     const currentSession = supabase.auth.session();
//     setSession(currentSession);

//     if (!currentSession) {
//       router.push('/login'); // Redirect to login if no session
//     }

//     // Subscribe to auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       if (!session) {
//         router.push('/login');
//       }
//     });

//     // Unsubscribe from the auth listener when component unmounts
//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, [router]);

//   return session ? (
//     <div>Welcome to the Dashboard!</div>
//   ) : (
//     <div>Loading...</div>
//   );
// };

// export default Dashboard;
