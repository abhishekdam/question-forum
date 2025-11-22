import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Post {
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

	const fetchPosts = async () => {
		try {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setPosts(data || []);
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
	};

	const fetchReplies = async (postId: string) => {
		try {
			const { data, error } = await supabase
				.from("replies")
				.select("*")
				.eq("post_id", postId)
				.order("created_at", { ascending: true });

			if (error) throw error;
			setReplies((prev) => ({ ...prev, [postId]: data || [] }));
		} catch (error) {
			console.error("Error fetching replies:", error);
		}
	};

	const createPost = async (
		title: string,
		content: string,
		authorName: string
	) => {
		const { error } = await supabase.from("posts").insert({
			title,
			content,
			author_name: authorName,
		});

		if (error) throw error;
	};

	const addReply = async (
		postId: string,
		content: string,
		authorName: string
	) => {
		const { error } = await supabase.from("replies").insert({
			post_id: postId,
			content,
			author_name: authorName,
		});

		if (error) throw error;
	};

	const upvotePost = async (postId: string) => {
		const post = posts.find((p) => p.id === postId);
		if (!post) return;

		const { error } = await supabase
			.from("posts")
			.update({ votes: post.votes + 1 })
			.eq("id", postId);

		if (error) throw error;
	};

	const markAsAnswered = async (postId: string) => {
		const { error } = await supabase
			.from("posts")
			.update({ is_answered: true })
			.eq("id", postId);

		if (error) throw error;
	};

	useEffect(() => {
		fetchPosts();

		// Set up realtime subscription
		const postsChannel = supabase
			.channel("posts-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "posts",
				},
				() => {
					fetchPosts();
				}
			)
			.subscribe();

		const repliesChannel = supabase
			.channel("replies-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "replies",
				},
				(payload) => {
					if (payload.eventType === "INSERT" && payload.new) {
						const newReply = payload.new as Reply;
						fetchReplies(newReply.post_id);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(postsChannel);
			supabase.removeChannel(repliesChannel);
		};
	}, []);

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
