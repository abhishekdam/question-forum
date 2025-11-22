import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
	// The ID of the post being replied to
	postId: string;

	// Callback function when reply is submitted
	onAddReply: (
		postId: string,
		content: string,
		authorName: string
	) => Promise<void>;
}

export const ReplyForm = ({ postId, onAddReply }: ReplyFormProps) => {
	// Reply content textarea state
	const [content, setContent] = useState("");

	// Author name input state
	const [authorName, setAuthorName] = useState("");

	// Loading state during form submission
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Toast notification hook
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate that both form fields have content
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
			// Call the parent callback to create reply in database
			// Pass postId to associate reply with the correct post
			await onAddReply(postId, content, authorName);

			// Clear form fields after successful submission
			setContent("");
			setAuthorName("");

			// Show success notification to user
			toast({
				title: "Success!",
				description: "Your reply has been posted",
			});
		} catch (error) {
			// Show error notification if submission fails
			toast({
				title: "Error",
				description: "Failed to add reply. Please try again.",
				variant: "destructive",
			});
		} finally {
			// Always reset loading state, whether success or error
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
			{/* Author Name Input Section */}
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

			{/* Reply Content Textarea Section */}
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

			{/* Submit Button - validates form and creates reply */}
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
