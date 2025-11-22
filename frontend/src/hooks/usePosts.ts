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
	const [posts, setPosts] = useState<Post[]>([]);
	const [replies, setReplies] = useState<Record<string, Reply[]>>({});
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

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

	const fetchReplies = useCallback(async (postId: string) => {
		try {
			const data = await fetchPostReplies(postId);
			setReplies((prev) => ({ ...prev, [postId]: data || [] }));
		} catch (error) {
			console.error("Error fetching replies:", error);
		}
	}, []);

	const createPost = async (
		title: string,
		content: string,
		author_name: string
	) => {
		console.log("Creating post with author_name:", title, content, author_name);
		try {
			await createNewPost(title, content, author_name);
			fetchPosts();
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

	const addReply = async (
		postId: string,
		content: string,
		authorName: string
	) => {
		try {
			await addPostReply(postId, content, authorName);
			fetchReplies(postId);
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

	const upvotePost = async (postId: string) => {
		try {
			await upvotePostById(postId);
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

	const markAsAnswered = async (postId: string) => {
		try {
			await markPostAsAnswered(postId);
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

	useEffect(() => {
		fetchPosts();

		const intervalId = setInterval(fetchPosts, 5000);

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
