import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

import {
	fetchAllPosts,
	fetchPostReplies,
	createNewPost,
	addPostReply,
	upvotePostById,
	markPostAsAnswered,
} from "@/api/axios";

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

export const usePosts = () => {
	// State management
	const [posts, setPosts] = useState<Post[]>([]);
	const [replies, setReplies] = useState<Record<string, Reply[]>>({});
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	/**
	 * Fetch all posts from the server
	 * Updates the posts state with the latest data from the backend
	 */
	const fetchPosts = useCallback(async () => {
		try {
			const data = await fetchAllPosts();
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

	/**
	 * Fetch replies for a specific post
	 * Stores replies in the replies state object keyed by post ID
	 *
	 */
	const fetchReplies = useCallback(async (postId: string) => {
		try {
			const data = await fetchPostReplies(postId);
			setReplies((prev) => ({ ...prev, [postId]: data || [] }));
		} catch (error) {
			console.error("Error fetching replies:", error);
		}
	}, []);

	/**
	 * Create a new forum post
	 * Sends the post data to the backend and refreshes the posts list
	 *
	 */
	const createPost = async (
		title: string,
		content: string,
		author_name: string
	) => {
		console.log("Creating post with author_name:", title, content, author_name);
		try {
			await createNewPost(title, content, author_name);
			fetchPosts(); // Refresh posts list after creation
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

	/**
	 * Add a reply to a specific post
	 * Sends the reply to the backend and refreshes the replies for that post
	 *
	 */
	const addReply = async (
		postId: string,
		content: string,
		authorName: string
	) => {
		try {
			await addPostReply(postId, content, authorName);
			fetchReplies(postId); // Refresh replies for this post
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

	/**
	 * Upvote a post (increment votes by 1)
	 * Sends the upvote request to the backend and refreshes the posts list
	 *
	 */
	const upvotePost = async (postId: string) => {
		try {
			await upvotePostById(postId);
			fetchPosts(); // Refresh posts to get updated vote count
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

	/**
	 * Mark a post as answered
	 * Sets the is_answered flag to true and refreshes the posts list
	 *
	 */
	const markAsAnswered = async (postId: string) => {
		try {
			await markPostAsAnswered(postId);
			fetchPosts(); // Refresh posts to get updated answered status
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

	/**
	 * Effect Hook: Automatic Polling
	 */
	useEffect(() => {
		fetchPosts();

		// Set up interval to fetch posts every 5 seconds
		const intervalId = setInterval(fetchPosts, 5000);

		// Cleanup: clear interval when component unmounts
		return () => {
			clearInterval(intervalId);
		};
	}, [fetchPosts]);

	// Return all functions and state for use in components
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
