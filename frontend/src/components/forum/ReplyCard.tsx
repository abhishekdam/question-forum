import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ReplyCardProps {
	content: string;
	authorName: string;
	createdAt: string;
}

export const ReplyCard = ({
	content,
	authorName,
	createdAt,
}: ReplyCardProps) => {
	return (
		<Card className="p-3 sm:p-4 bg-muted/30 border-border">
			<p className="text-sm sm:text-base text-foreground mb-3">{content}</p>
			<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm text-muted-foreground">
				<span className="font-medium text-foreground truncate">
					{authorName}
				</span>
				<span className="hidden xs:inline">•</span>
				<span>
					{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
				</span>
			</div>
		</Card>
	);
};
