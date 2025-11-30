/// <reference types="vite/client" />

/**
 * Vite Environment Variables Type Definitions
 *
 * This file provides TypeScript types for environment variables used in the frontend.
 * Vite exposes environment variables through import.meta.env, and this file tells
 * TypeScript what variables are available and their types.
 */

interface ImportMetaEnv {
	/**
	 * Supabase project URL
	 * Format: https://[project-id].supabase.co
	 */
	readonly VITE_SUPABASE_URL: string;

	/**
	 * Supabase anonymous key (public)
	 * Used for client-side authentication and database access
	 */
	readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
