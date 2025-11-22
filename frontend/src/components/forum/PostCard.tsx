import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, MessageCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface PostCardProps {
	id: string;
	title: string;
	content: string;
	votes: number;
	isAnswered: boolean;
	authorName: string;
	createdAt: string;
	replyCount?: number;
	onVote: (id: string) => void;
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
				{/* Vote Section */}
				<div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 min-w-max sm:min-w-[60px]">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleVote}
						className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-accent/10 hover:text-accent vote-transition"
					>
						<ArrowBigUp className="h-5 w-5 sm:h-6 sm:w-6" />
					</Button>
					<span className="text-base sm:text-lg font-semibold text-foreground">
						{votes}
					</span>
					<span className="hidden sm:inline text-xs text-muted-foreground">
						votes
					</span>
				</div>

				{/* Content Section */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
						<h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
							{title}
						</h3>
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

					<p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
						{content}
					</p>

					<div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
						<div className="flex items-center gap-1 flex-shrink-0">
							<MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
							<span>
								{replyCount} {replyCount === 1 ? "reply" : "replies"}
							</span>
						</div>
						<span className="hidden xs:inline">•</span>
						<span className="truncate">By {authorName}</span>
						<span className="hidden sm:inline">•</span>
						<span className="hidden sm:inline">
							{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};
