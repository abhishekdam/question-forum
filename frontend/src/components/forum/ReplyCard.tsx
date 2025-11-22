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
		<Card className="p-4 bg-muted/30 border-border">
			<p className="text-foreground mb-3">{content}</p>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span className="font-medium text-foreground">{authorName}</span>
				<span>•</span>
				<span>
					{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
				</span>
			</div>
		</Card>
	);
};
