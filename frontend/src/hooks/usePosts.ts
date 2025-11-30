import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";

import {
	fetchAllPosts,
	fetchPostReplies,
	createNewPost,
	addPostReply,
	upvotePostById,
	markPostAsAnswered,
	deletePostById,
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
	 * Sends the post data to the backend
	 * Real-time subscription automatically adds the new post to the UI
	 */
	const createPost = async (
		title: string,
		content: string,
		author_name: string
	) => {
		console.log("Creating post with author_name:", title, content, author_name);
		try {
			await createNewPost(title, content, author_name);
			fetchPosts(); // Refresh posts list
			// Real-time subscription will handle the UI update automatically
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
	 * Sends the reply to the backend. We still need to manually fetchReplies here
	 * because the 'replies' table might not be fully synchronized in the same way
	 * as the 'posts' table is for the main feed.
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
			// Note: The post's reply_count update is handled by the Realtime listener on the 'posts' table.
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
	 * Sends the upvote request to the backend
	 * Real-time subscription automatically updates the UI
	 */
	const upvotePost = async (postId: string) => {
		try {
			await upvotePostById(postId);
			fetchPosts(); // Refresh posts list
			// Real-time subscription will handle the UI update automatically
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
	 * Sends the request to the backend
	 * Real-time subscription automatically updates the UI
	 */
	const markAsAnswered = async (postId: string) => {
		try {
			await markPostAsAnswered(postId);
			fetchPosts(); // Refresh posts list
			// Real-time subscription will handle the UI update automatically
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
	 * Delete a post
	 * Removes a post and all associated replies from the database
	 * Real-time subscription automatically removes the post from the UI
	 */
	const deletePost = async (postId: string) => {
		try {
			await deletePostById(postId);
			fetchPosts(); // Refresh posts list
			// Real-time subscription will handle the UI update automatically

			toast({
				title: "Success",
				description: "Post deleted successfully",
			});
			return true;
		} catch (error) {
			console.error("Error deleting post:", error);
			toast({
				title: "Error",
				description: "Failed to delete post",
				variant: "destructive",
			});
			throw error;
		}
	};

	/**
	 * Subscribe to real-time changes on the posts table
	 * Uses Supabase's real-time subscriptions to listen for INSERT, UPDATE, DELETE events
	 * This eliminates the need for polling and reduces API calls
	 */
	const subscribeToPostsChanges = (
		callback: (newPost: Post, eventType: string) => void
	) => {
		return supabase
			.channel("public:posts")
			.on(
				"postgres_changes",
				{
					event: "*", // Listen for INSERT, UPDATE, DELETE
					schema: "public",
					table: "posts",
				},
				(payload) => {
					const newPost = payload.new as Post;
					const oldPost = payload.old as Post;
					const eventType = payload.eventType;

					// Call the callback with the relevant data
					callback(newPost || oldPost, eventType);
				}
			)
			.subscribe();
	};

	/**
	 * Effect Hook: Initialize Posts and Set up Real-time Subscription
	 * Fetches initial posts once, then uses real-time subscriptions for updates
	 * This approach minimizes API calls compared to polling
	 */
	useEffect(() => {
		// 1. Fetch initial state once
		fetchPosts();

		// 2. Set up real-time subscription for all post changes
		const subscription = subscribeToPostsChanges((changedPost, eventType) => {
			// Update posts state based on the event type
			setPosts((prevPosts) => {
				const existingIndex = prevPosts.findIndex(
					(p) => p.id === changedPost.id
				);

				if (eventType === "INSERT") {
					// Add new post to the top of the list if it doesn't exist
					if (existingIndex === -1) {
						return [changedPost, ...prevPosts];
					}
					return prevPosts;
				} else if (eventType === "UPDATE") {
					// Update the existing post with new data
					if (existingIndex !== -1) {
						const updatedPosts = [...prevPosts];
						updatedPosts[existingIndex] = changedPost;
						return updatedPosts;
					}
					return prevPosts;
				} else if (eventType === "DELETE") {
					// Remove the deleted post
					return prevPosts.filter((post) => post.id !== changedPost.id);
				}

				return prevPosts;
			});
		});

		// Cleanup: Unsubscribe when component unmounts
		return () => {
			subscription.unsubscribe();
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
		deletePost,
	};
};
