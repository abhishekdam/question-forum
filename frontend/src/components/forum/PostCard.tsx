import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, MessageCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface PostCardProps {
	// Post ID for routing and actions
	id: string;

	// Post title (displayed as heading)
	title: string;

	// Post content (truncated to 2 lines as preview)
	content: string;

	// Number of upvotes
	votes: number;

	// Whether post has been marked as answered
	isAnswered: boolean;

	// Name of user who created the post
	authorName: string;

	// ISO timestamp of post creation
	createdAt: string;

	// Number of replies/answers to the post (default: 0)
	replyCount?: number;

	// Callback function when upvote button clicked
	// Receives: post ID
	onVote: (id: string) => void;

	// Callback function when card clicked
	// Receives: post ID
	onClick: (id: string) => void;
}

export const PostCard = ({
	id,
	title,
	content,
	votes,
	isAnswered,
	authorName,
	createdAt,
	replyCount = 0,
	onVote,
	onClick,
}: PostCardProps) => {
	const handleVote = (e: React.MouseEvent) => {
		e.stopPropagation();
		onVote(id);
	};

	return (
		<Card
			className="p-3 sm:p-4 md:p-6 cursor-pointer card-hover border-border"
			onClick={() => onClick(id)}
		>
			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
				{/* Vote Section - Responsive Layout */}
				<div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 min-w-max sm:min-w-[60px]">
					{/* Upvote Button */}
					<Button
						variant="ghost"
						size="sm"
						onClick={handleVote}
						className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-accent/10 hover:text-accent vote-transition"
					>
						<ArrowBigUp className="h-5 w-5 sm:h-6 sm:w-6" />
					</Button>

					{/* Vote Count */}
					<span className="text-base sm:text-lg font-semibold text-foreground">
						{votes}
					</span>

					{/* Vote Label - Desktop only */}
					<span className="hidden sm:inline text-xs text-muted-foreground">
						votes
					</span>
				</div>

				{/* Post Info Section */}
				<div className="flex-1 min-w-0">
					{/* Title and Status Section */}
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
						{/* Post Title - Line clamped to 2 lines */}
						<h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
							{title}
						</h3>

						{/* Answered Status Badge - Only shown if answered */}
						{isAnswered && (
							<Badge
								variant="outline"
								className="bg-answered/10 text-answered border-answered/30 shrink-0 w-fit"
							>
								<CheckCircle className="h-3 w-3 mr-1" />
								Answered
							</Badge>
						)}
					</div>

					{/* Content Preview - Line clamped to 2 lines */}
					<p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
						{content}
					</p>

					{/* Post Metadata Section */}
					<div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
						{/* Reply Count with Icon */}
						<div className="flex items-center gap-1 flex-shrink-0">
							<MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
							<span>
								{replyCount} {replyCount === 1 ? "reply" : "replies"}
							</span>
						</div>

						{/* Separator - Tablet and above */}
						<span className="hidden xs:inline">•</span>

						{/* Author Name - Truncated to prevent overflow */}
						<span className="truncate">By {authorName}</span>

						{/* Separator - Desktop only */}
						<span className="hidden sm:inline">•</span>

						{/* Time Posted - Desktop only, shows relative time */}
						<span className="hidden sm:inline">
							{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};
