import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
	// Callback function when post is created
	onCreatePost: (
		title: string,
		content: string,
		authorName: string
	) => Promise<void>;
}

export const CreatePostDialog = ({ onCreatePost }: CreatePostDialogProps) => {
	// Dialog open/close state
	const [open, setOpen] = useState(false);

	// Form field states
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [authorName, setAuthorName] = useState("");

	// Loading state during form submission
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Toast notification hook
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate that all form fields have content
		if (!title.trim() || !content.trim() || !authorName.trim()) {
			toast({
				title: "Missing fields",
				description: "Please fill in all fields",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			// Call the parent callback to create post in database
			await onCreatePost(title, content, authorName);

			// Clear form fields after successful submission
			setTitle("");
			setContent("");
			setAuthorName("");

			// Close dialog modal
			setOpen(false);

			// Show success notification to user
			toast({
				title: "Success!",
				description: "Your question has been posted",
			});
		} catch (error) {
			// Show error notification if submission fails
			toast({
				title: "Error",
				description: "Failed to create post. Please try again.",
				variant: "destructive",
			});
		} finally {
			// Always reset loading state, whether success or error
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Trigger Button */}
			<DialogTrigger asChild>
				<Button size="lg" className="gap-2 font-semibold w-full sm:w-auto">
					<Plus className="h-5 w-5" />
					{/* Shows "New Question" on desktop, "Ask" on mobile */}
					<span className="hidden sm:inline">New Question</span>
					<span className="sm:hidden">Ask</span>
				</Button>
			</DialogTrigger>

			{/* Dialog Modal Content */}
			<DialogContent className="w-[95vw] sm:w-full sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl">Ask a Question</DialogTitle>
					<DialogDescription>
						Share your question with the Learnato community
					</DialogDescription>
				</DialogHeader>

				{/* Form with submission handler */}
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					{/* Author Name Input */}
					<div className="space-y-2">
						<Label htmlFor="author">Your Name</Label>
						<Input
							id="author"
							placeholder="Enter your name"
							value={authorName}
							onChange={(e) => setAuthorName(e.target.value)}
							disabled={isSubmitting}
						/>
					</div>

					{/* Question Title Input */}
					<div className="space-y-2">
						<Label htmlFor="title">Question Title</Label>
						<Input
							id="title"
							placeholder="e.g., How do I deploy Node.js on Cloud Run?"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							disabled={isSubmitting}
						/>
					</div>

					{/* Question Content/Details Textarea */}
					<div className="space-y-2">
						<Label htmlFor="content">Question Details</Label>
						<Textarea
							id="content"
							placeholder="Provide more details about your question..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="min-h-[150px]"
							disabled={isSubmitting}
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-2">
						{/* Cancel Button - closes dialog without saving */}
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>

						{/* Submit Button - validates and creates post */}
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Posting..." : "Post Question"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
