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
	onCreatePost: (
		title: string,
		content: string,
		authorName: string
	) => Promise<void>;
}

export const CreatePostDialog = ({ onCreatePost }: CreatePostDialogProps) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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
			await onCreatePost(title, content, authorName);
			setTitle("");
			setContent("");
			setAuthorName("");
			setOpen(false);
			toast({
				title: "Success!",
				description: "Your question has been posted",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create post. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="lg" className="gap-2 font-semibold">
					<Plus className="h-5 w-5" />
					New Question
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Ask a Question</DialogTitle>
					<DialogDescription>
						Share your question with the Learnato community
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Posting..." : "Post Question"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
