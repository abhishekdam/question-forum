import axios from "axios";
import { Post, Reply } from "@/hooks/usePosts";

const API_BASE_URL = "http://localhost:4000";

export const fetchAllPosts = async (): Promise<Post[]> => {
	const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`);
	return response.data || [];
};

export const fetchPostReplies = async (postId: string): Promise<Reply[]> => {
	const response = await axios.get<Reply[]>(
		`${API_BASE_URL}/posts/${postId}/replies`
	);
	return response.data || [];
};

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

export const upvotePostById = async (postId: string): Promise<void> => {
	await axios.patch(`${API_BASE_URL}/posts/${postId}/upvote`);
};

export const markPostAsAnswered = async (postId: string): Promise<void> => {
	await axios.patch(`${API_BASE_URL}/posts/${postId}/answered`, {
		is_answered: true,
	});
};
