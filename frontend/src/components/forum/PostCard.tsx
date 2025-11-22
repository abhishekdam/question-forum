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
			className="p-6 cursor-pointer card-hover border-border"
			onClick={() => onClick(id)}
		>
			<div className="flex gap-4">
				{/* Vote Section */}
				<div className="flex flex-col items-center gap-1 min-w-[60px]">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleVote}
						className="h-10 w-10 p-0 hover:bg-accent/10 hover:text-accent vote-transition"
					>
						<ArrowBigUp className="h-6 w-6" />
					</Button>
					<span className="text-lg font-semibold text-foreground">{votes}</span>
					<span className="text-xs text-muted-foreground">votes</span>
				</div>

				{/* Content Section */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-4 mb-2">
						<h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
							{title}
						</h3>
						{isAnswered && (
							<Badge
								variant="outline"
								className="bg-answered/10 text-answered border-answered/30 shrink-0"
							>
								<CheckCircle className="h-3 w-3 mr-1" />
								Answered
							</Badge>
						)}
					</div>

					<p className="text-muted-foreground mb-4 line-clamp-2">{content}</p>

					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">
							<MessageCircle className="h-4 w-4" />
							<span>
								{replyCount} {replyCount === 1 ? "reply" : "replies"}
							</span>
						</div>
						<span>•</span>
						<span>Posted by {authorName}</span>
						<span>•</span>
						<span>
							{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};
