import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
	postId: string;
	onAddReply: (
		postId: string,
		content: string,
		authorName: string
	) => Promise<void>;
}

export const ReplyForm = ({ postId, onAddReply }: ReplyFormProps) => {
	const [content, setContent] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim() || !authorName.trim()) {
			toast({
				title: "Missing fields",
				description: "Please fill in all fields",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			await onAddReply(postId, content, authorName);
			setContent("");
			setAuthorName("");
			toast({
				title: "Success!",
				description: "Your reply has been posted",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to add reply. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
			<div className="space-y-1 sm:space-y-2">
				<Label htmlFor="reply-author" className="text-xs sm:text-sm">
					Your Name
				</Label>
				<Input
					id="reply-author"
					placeholder="Enter your name"
					value={authorName}
					onChange={(e) => setAuthorName(e.target.value)}
					disabled={isSubmitting}
					className="text-sm"
				/>
			</div>
			<div className="space-y-1 sm:space-y-2">
				<Label htmlFor="reply-content" className="text-xs sm:text-sm">
					Your Reply
				</Label>
				<Textarea
					id="reply-content"
					placeholder="Share your insights or answer..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="min-h-[100px] sm:min-h-[120px] text-sm"
					disabled={isSubmitting}
				/>
			</div>
			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full sm:w-auto"
			>
				{isSubmitting ? "Posting..." : "Post Reply"}
			</Button>
		</form>
	);
};
