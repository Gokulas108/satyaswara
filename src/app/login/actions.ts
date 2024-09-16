"use server";
import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/utils/schemas/loginSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
	const supabase = createClient();

	// Convert FormData to an object
	const data = Object.fromEntries(formData.entries());

	// Validate the input using zod schema
	const parsedData = loginSchema.safeParse(data);

	if (!parsedData.success) {
		return {
			status: 400,
			errors: parsedData.error.errors,
		};
	}

	const { email, password } = parsedData.data;
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		// Invalid credentials
		return {
			status: 401,
			error: error.message,
		};
	} else {
		if (password === "123456") {
			revalidatePath("/", "layout");
			redirect("/dashboard");
		} else {
			revalidatePath("/", "layout");
			redirect("/dashboard");
		}
	}
}
