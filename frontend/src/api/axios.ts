import axios from "axios";
import { Post, Reply } from "@/hooks/usePosts";

// Backend API base URL
const API_BASE_URL = "http://localhost:4000";

/**
 * Fetch All Posts
 *
 * Returns: Array of Post objects sorted by creation date (newest first)
 */
export const fetchAllPosts = async (): Promise<Post[]> => {
	const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);
	return response.data || [];
};

/**
 * Fetch Replies for a Specific Post
 *
 * Retrieves all replies/comments for a given post
 * Returns: Array of Reply objects sorted by creation date (oldest first)
 */
export const fetchPostReplies = async (postId: string): Promise<Reply[]> => {
	const response = await axios.get<Reply[]>(
		`${API_BASE_URL}/posts/${postId}/replies`
	);
	return response.data || [];
};

/**
 * Create a New Post
 *
 * Creates a new forum question/post on the backend
 *
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
 * Add a Reply to a Post
 *
 * Creates a new reply/comment on an existing post
 */
export const addPostReply = async (
	postId: string,
	content: string,
	authorName: string
): Promise<void> => {
	await axios.post(`${API_BASE_URL}/posts/${postId}/replies`, {
		content,
		author_name: authorName,
	});
};

/**
 * Upvote a Post
 * Increments the vote count of a post by 1
 */
export const upvotePostById = async (postId: string): Promise<void> => {
	await axios.patch(`${API_BASE_URL}/posts/${postId}/upvote`);
};

/**
 * Mark a Post as Answered
 * Sets the is_answered flag to true, indicating the question has been answered
 */
export const markPostAsAnswered = async (postId: string): Promise<void> => {
	await axios.patch(`${API_BASE_URL}/posts/${postId}/answered`, {
		is_answered: true,
	});
};

/**
 * Delete a Post
 * Removes a post and all associated replies from the database
 */
export const deletePostById = async (postId: string): Promise<void> => {
	await axios.delete(`${API_BASE_URL}/posts/${postId}`);
};
