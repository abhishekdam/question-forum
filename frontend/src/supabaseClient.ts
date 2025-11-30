import { createClient } from "@supabase/supabase-js";

// Load environment variables for the Supabase URL and anonymous key.
// In a typical React setup, these are loaded from a .env file via your build tool (like Vite or Webpack).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
	console.error(
		"Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing."
	);
	// Throw an error or use a fallback in a production environment
}

// Create and export the Supabase client instance
// This client can be imported anywhere in your frontend application (e.g., in usePosts.ts)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Note:
 * - This file sets up the connection once.
 * - The client uses the anonymous key for read operations and relies on
 * user authentication (handled elsewhere) for write/update operations.
 * - This pattern ensures you only import the 'supabase' object, not the
 * initialization logic, making your hook logic cleaner.
 */
