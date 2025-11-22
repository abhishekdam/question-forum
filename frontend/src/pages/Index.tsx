import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { PostCard } from "@/components/forum/PostCard";
import { CreatePostDialog } from "@/components/forum/CreatePostDialog";
import { SearchBar } from "@/components/forum/SearchBar";
import { SortSelect, SortOption } from "@/components/forum/SortSelect";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
	// Router navigation hook
	const navigate = useNavigate();

	// Get posts data and functions from custom hook
	const { posts, replies, loading, createPost, upvotePost } = usePosts();

	// State for search functionality
	const [searchQuery, setSearchQuery] = useState("");

	// State for sort selection (votes or date)
	const [sortBy, setSortBy] = useState<SortOption>("votes");

	/**
	 * Filter and sort posts based on search query and sort option
	 */
	const filteredAndSortedPosts = useMemo(() => {
		// Filter posts by title or content matching the search query
		const filtered = posts.filter(
			(post) =>
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.content.toLowerCase().includes(searchQuery.toLowerCase())
		);

		// Sort filtered posts by selected option
		return filtered.sort((a, b) => {
			if (sortBy === "votes") {
				// Sort by votes (highest first)
				return b.votes - a.votes;
			} else {
				// Sort by creation date (newest first)
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			}
		});
	}, [posts, searchQuery, sortBy]);

	/**
	 * Get reply count for a specific post
	 */
	const getReplyCount = (postId: string) => {
		return replies[postId]?.length || 0;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
					<Skeleton className="h-12 sm:h-16 w-full" />
					<Skeleton className="h-32 sm:h-40 w-full" />
					<Skeleton className="h-32 sm:h-40 w-full" />
					<Skeleton className="h-32 sm:h-40 w-full" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
				<header className="space-y-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
							<div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
								<MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
							</div>
							<div className="min-w-0">
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground truncate">
									Learnato Forum
								</h1>
								<p className="text-xs sm:text-sm text-muted-foreground">
									Empower learning through conversation
								</p>
							</div>
						</div>
						<div className="w-full sm:w-auto">
							<CreatePostDialog onCreatePost={createPost} />
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
						<div className="flex-1 min-w-0">
							<SearchBar value={searchQuery} onChange={setSearchQuery} />
						</div>
						<div className="w-full sm:w-auto">
							<SortSelect value={sortBy} onChange={setSortBy} />
						</div>
					</div>
				</header>

				<div className="space-y-4">
					{filteredAndSortedPosts.length > 0 ? (
						filteredAndSortedPosts.map((post) => (
							<PostCard
								key={post.id}
								id={post.id}
								title={post.title}
								content={post.content}
								votes={post.votes}
								isAnswered={post.is_answered}
								authorName={post.author_name}
								createdAt={post.created_at}
								replyCount={post.reply_count || 0}
								onVote={upvotePost}
								onClick={(id) => navigate(`/post/${id}`)}
							/>
						))
					) : (
						<div className="text-center py-16">
							<p className="text-muted-foreground text-lg">
								{searchQuery
									? "No questions found matching your search"
									: "No questions yet. Be the first to ask!"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Index;
