import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowBigUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReplyCard } from "@/components/forum/ReplyCard";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { usePosts } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

const PostDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { posts, replies, fetchReplies, addReply, upvotePost, markAsAnswered } =
		usePosts();
	const [post, setPost] = useState(posts.find((p) => p.id === id));

	useEffect(() => {
		if (id) {
			fetchReplies(id);
		}
	}, [id]);

	useEffect(() => {
		setPost(posts.find((p) => p.id === id));
	}, [posts, id]);

	if (!post) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-muted-foreground">Post not found</p>
			</div>
		);
	}

	const postReplies = id ? replies[id] || [] : [];

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto p-6 space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/")}
						className="gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
				</div>

				{/* Post Card */}
				<Card className="p-6">
					<div className="flex gap-6">
						{/* Vote Section */}
						<div className="flex flex-col items-center gap-2">
							<Button
								variant="ghost"
								size="lg"
								onClick={() => upvotePost(post.id)}
								className="h-12 w-12 p-0 hover:bg-accent/10 hover:text-accent vote-transition"
							>
								<ArrowBigUp className="h-8 w-8" />
							</Button>
							<span className="text-2xl font-bold text-foreground">
								{post.votes}
							</span>
							<span className="text-sm text-muted-foreground">votes</span>
						</div>

						{/* Content */}
						<div className="flex-1">
							<div className="flex items-start justify-between gap-4 mb-4">
								<h1 className="text-3xl font-bold text-foreground">
									{post.title}
								</h1>
								{post.is_answered ? (
									<Badge
										variant="outline"
										className="bg-answered/10 text-answered border-answered/30"
									>
										<CheckCircle className="h-4 w-4 mr-1" />
										Answered
									</Badge>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={() => markAsAnswered(post.id)}
										className="gap-2"
									>
										<CheckCircle className="h-4 w-4" />
										Mark as Answered
									</Button>
								)}
							</div>

							<p className="text-foreground text-lg mb-4 whitespace-pre-wrap">
								{post.content}
							</p>

							<div className="flex items-center gap-3 text-sm text-muted-foreground">
								<span className="font-medium text-foreground">
									{post.author_name}
								</span>
								<span>•</span>
								<span>
									{formatDistanceToNow(new Date(post.created_at), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					</div>
				</Card>

				{/* Replies Section */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-foreground">
							{postReplies.length}{" "}
							{postReplies.length === 1 ? "Reply" : "Replies"}
						</h2>
					</div>

					<Separator />

					{postReplies.length > 0 ? (
						<div className="space-y-4">
							{postReplies.map((reply) => (
								<ReplyCard
									key={reply.id}
									content={reply.content}
									authorName={reply.author_name}
									createdAt={reply.created_at}
								/>
							))}
						</div>
					) : (
						<Card className="p-8 text-center">
							<p className="text-muted-foreground">
								No replies yet. Be the first to share your insights!
							</p>
						</Card>
					)}

					<Separator className="my-8" />

					{/* Reply Form */}
					<div>
						<h3 className="text-xl font-semibold text-foreground mb-4">
							Add Your Reply
						</h3>
						<ReplyForm postId={post.id} onAddReply={addReply} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetail;
