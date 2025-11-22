// src/hooks/usePosts.ts

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// ✨ NEW: Import the API service functions
import {
	fetchAllPosts,
	fetchPostReplies,
	createNewPost,
	addPostReply,
	upvotePostById,
	markPostAsAnswered,
} from "@/api/axios"; // Adjust path as needed

// --- Interface Definitions (Keep these here for use in the hook) ---
export interface Post {
	reply_count: number;
	id: string;
	title: string;
	content: string;
	votes: number;
	is_answered: boolean;
	author_name: string;
	created_at: string;
	updated_at: string;
}

export interface Reply {
	id: string;
	post_id: string;
	content: string;
	author_name: string;
	created_at: string;
}
// ------------------------------------------

export const usePosts = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [replies, setReplies] = useState<Record<string, Reply[]>>({});
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	// Fetches all posts using the centralized API function
	const fetchPosts = useCallback(async () => {
		try {
			const data = await fetchAllPosts(); // 🎯 CALL THE SERVICE FUNCTION
			setPosts(data);
		} catch (error) {
			console.error("Error fetching posts:", error);
			toast({
				title: "Error",
				description: "Failed to load posts",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}, [toast]);

	// Fetches replies for a specific post
	const fetchReplies = useCallback(async (postId: string) => {
		try {
			const data = await fetchPostReplies(postId); // 🎯 CALL THE SERVICE FUNCTION
			setReplies((prev) => ({ ...prev, [postId]: data || [] }));
		} catch (error) {
			console.error("Error fetching replies:", error);
		}
	}, []);

	// Creates a new post
	const createPost = async (
		title: string,
		content: string,
		author_name: string
	) => {
		console.log("Creating post with author_name:", title, content, author_name);
		try {
			await createNewPost(title, content, author_name); // 🎯 CALL THE SERVICE FUNCTION
			fetchPosts(); // Refetch posts to update the list
		} catch (error) {
			console.error("Error creating post:", error);
			toast({
				title: "Error",
				description: "Failed to create post",
				variant: "destructive",
			});
			throw error;
		}
	};

	// Adds a reply to a post
	const addReply = async (
		postId: string,
		content: string,
		authorName: string
	) => {
		try {
			await addPostReply(postId, content, authorName); // 🎯 CALL THE SERVICE FUNCTION
			fetchReplies(postId); // Fetch the updated replies for this post
		} catch (error) {
			console.error("Error adding reply:", error);
			toast({
				title: "Error",
				description: "Failed to add reply",
				variant: "destructive",
			});
			throw error;
		}
	};

	// Upvotes a post
	const upvotePost = async (postId: string) => {
		try {
			await upvotePostById(postId); // 🎯 CALL THE SERVICE FUNCTION
			fetchPosts();
		} catch (error) {
			console.error("Error upvoting post:", error);
			toast({
				title: "Error",
				description: "Failed to upvote post",
				variant: "destructive",
			});
			throw error;
		}
	};

	// Marks a post as answered
	const markAsAnswered = async (postId: string) => {
		try {
			await markPostAsAnswered(postId); // 🎯 CALL THE SERVICE FUNCTION
			fetchPosts();
		} catch (error) {
			console.error("Error marking post as answered:", error);
			toast({
				title: "Error",
				description: "Failed to mark post as answered",
				variant: "destructive",
			});
			throw error;
		}
	};

	// --- useEffect (Polling remains the same) ---

	useEffect(() => {
		fetchPosts();

		const intervalId = setInterval(fetchPosts, 5000); // Poll every 5 seconds

		return () => {
			clearInterval(intervalId);
		};
	}, [fetchPosts]);

	return {
		posts,
		replies,
		loading,
		fetchReplies,
		createPost,
		addReply,
		upvotePost,
		markAsAnswered,
	};
};
