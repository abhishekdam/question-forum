import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ReplyCardProps {
	// Content/text of the reply answer
	content: string;

	// Name of user who posted the reply
	authorName: string;

	// ISO timestamp of reply creation
	createdAt: string;
}

export const ReplyCard = ({
	content,
	authorName,
	createdAt,
}: ReplyCardProps) => {
	return (
		<Card className="p-3 sm:p-4 bg-muted/30 border-border">
			{/* Reply Content Text */}
			<p className="text-sm sm:text-base text-foreground mb-3">{content}</p>

			{/* Metadata Section - Author and Time */}
			<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm text-muted-foreground">
				{/* Author Name - Truncated if too long */}
				<span className="font-medium text-foreground truncate">
					{authorName}
				</span>

				{/* Separator - Tablet and above only */}
				<span className="hidden xs:inline">•</span>

				{/* Relative Time - Shows "2 hours ago" format */}
				<span>
					{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
				</span>
			</div>
		</Card>
	);
};
