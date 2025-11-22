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
			<div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="flex items-center gap-2 sm:gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/")}
						className="gap-1 sm:gap-2 px-2 sm:px-4"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Back</span>
					</Button>
				</div>

				{/* Post Card */}
				<Card className="p-3 sm:p-4 md:p-6">
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
						{/* Vote Section */}
						<div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 min-w-max sm:min-w-fit">
							<Button
								variant="ghost"
								size="lg"
								onClick={() => upvotePost(post.id)}
								className="h-9 w-9 sm:h-12 sm:w-12 p-0 hover:bg-accent/10 hover:text-accent vote-transition"
							>
								<ArrowBigUp className="h-6 w-6 sm:h-8 sm:w-8" />
							</Button>
							<span className="text-lg sm:text-2xl font-bold text-foreground">
								{post.votes}
							</span>
							<span className="hidden sm:inline text-sm text-muted-foreground">
								votes
							</span>
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
								<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
									{post.title}
								</h1>
								{post.is_answered ? (
									<Badge
										variant="outline"
										className="bg-answered/10 text-answered border-answered/30 w-fit flex-shrink-0"
									>
										<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
										<span className="text-xs sm:text-sm">Answered</span>
									</Badge>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={() => markAsAnswered(post.id)}
										className="gap-2 text-xs sm:text-sm w-full sm:w-auto"
									>
										<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden sm:inline">Mark as Answered</span>
										<span className="sm:hidden">Mark Answered</span>
									</Button>
								)}
							</div>

							<p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4 whitespace-pre-wrap break-words">
								{post.content}
							</p>

							<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-xs sm:text-sm text-muted-foreground">
								<span className="font-medium text-foreground truncate">
									{post.author_name}
								</span>
								<span className="hidden xs:inline">•</span>
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
				<div className="space-y-3 sm:space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg sm:text-2xl font-bold text-foreground">
							{postReplies.length}{" "}
							{postReplies.length === 1 ? "Reply" : "Replies"}
						</h2>
					</div>

					<Separator />

					{postReplies.length > 0 ? (
						<div className="space-y-3 sm:space-y-4">
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
						<Card className="p-6 sm:p-8 text-center">
							<p className="text-sm sm:text-base text-muted-foreground">
								No replies yet. Be the first to share your insights!
							</p>
						</Card>
					)}

					<Separator className="my-6 sm:my-8" />

					{/* Reply Form */}
					<div>
						<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
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
