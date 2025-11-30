import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.warn(
		"Warning: SUPABASE_URL or SUPABASE_KEY is not set. Check your .env file."
	);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
