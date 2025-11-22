// src/lib/axios.ts

import axios from "axios";
import { Post, Reply } from "@/hooks/usePosts"; // Assuming usePosts.ts is where these types are defined

// Define the base URL for the Express API
const API_BASE_URL = "http://localhost:4000";

// --- Service Functions ---

/**
 * Fetches all posts from the backend.
 * @returns Promise<Post[]>
 */
export const fetchAllPosts = async (): Promise<Post[]> => {
	const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);
	return response.data || [];
};

/**
 * Fetches replies for a specific post.
 * @param postId The ID of the post.
 * @returns Promise<Reply[]>
 */
export const fetchPostReplies = async (postId: string): Promise<Reply[]> => {
	// Assuming endpoint is /posts/ID/replies
	const response = await axios.get<Reply[]>(
		`${API_BASE_URL}/posts/${postId}/replies`
	);
	return response.data || [];
};

/**
 * Creates a new post.
 * @param title Post title.
 * @param content Post content.
 * @param authorName Author's name.
 */
export const createNewPost = async (
	title: string,
	content: string,
	author_name: string
): Promise<void> => {
	await axios.post(`${API_BASE_URL}/posts`, {
		title,
		content,
		author_name: author_name,
	});
};

/**
 * Adds a reply to a post.
 * @param postId The ID of the post to reply to.
 * @param content Reply content.
 * @param authorName Author's name.
 */
export const addPostReply = async (
	postId: string,
	content: string,
	authorName: string
): Promise<void> => {
	// Assuming endpoint is /posts/ID/replies
	await axios.post(`${API_BASE_URL}/posts/${postId}/replies`, {
		content,
		author_name: authorName,
	});
};

/**
 * Upvotes a post.
 * @param postId The ID of the post to upvote.
 */
export const upvotePostById = async (postId: string): Promise<void> => {
	// Assuming a PATCH action endpoint
	await axios.patch(`${API_BASE_URL}/posts/${postId}/upvote`);
};

/**
 * Marks a post as answered.
 * @param postId The ID of the post to mark as answered.
 */
export const markPostAsAnswered = async (postId: string): Promise<void> => {
	// Assuming a PATCH action endpoint
	await axios.patch(`${API_BASE_URL}/posts/${postId}/answered`, {
		is_answered: true,
	});
};
