/**
 * Forum API Backend
 *
 * This is the Express.js server that handles all API requests for the question forum.
 * It manages posts (questions), replies (answers/comments), and user interactions like voting.
 *
 * Database: PostgreSQL
 * Server: Express.js
 *
 * Main features:
 * - Create, read, update, and delete forum posts
 * - Add and fetch replies to posts
 * - Upvote posts
 * - Mark posts as answered
 */

import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import supabase from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = 4000;

// Configure CORS to allow Railway frontend
const allowedOrigins = [
	"http://localhost:3000", // Local development
	"http://localhost:5173", // Vite dev server
	"https://question-forum-production-8636.up.railway.app", // Railway production
	"https://*.railway.app", // Allow all Railway deployments
];

const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		if (
			allowedOrigins.some((allowed) => {
				if (allowed.includes("*")) {
					const regex = new RegExp(allowed.replace("*", ".*"));
					return regex.test(origin);
				}
				return origin === allowed;
			})
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS for cross-origin requests
app.use(morgan("dev")); // Log HTTP requests in development format
app.use(express.json()); // Parse incoming JSON requests

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

/**
 * Fetch All Posts
 *
 * Retrieves all forum posts sorted by creation date
 *
 * Response:
 * [{
 *   id: string (UUID),
 *   title: string,
 *   content: string,
 *   votes: number,
 *   is_answered: boolean,
 *   author_name: string,
 *   created_at: timestamp,
 *   updated_at: timestamp,
 *   reply_count: number
 * }]
 */
app.get("/posts", async (_req: Request, res: Response) => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*, replies(count)")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase error fetching posts:", error.message);
			return res.status(500).json({ error: error.message });
		}

		const posts = data?.map((post) => {
			const replyCount = post.replies?.[0]?.count || 0;
			const { replies, ...postData } = post;

			return {
				...postData,
				reply_count: replyCount,
			};
		});

		res.json(posts || []);
	} catch (err) {
		console.error("Unexpected error fetching posts:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Create a New Post
 * *
 * Creates a new forum question/post
 *
 * Request Body:
 * {
 *   title: string (required),
 *   content: string (required),
 *   author_name: string (optional)
 * }
 *
 * Response: The newly created post object with ID and timestamps
 *
 */
app.post("/posts", async (req: Request, res: Response) => {
	const { title, content, author_name } = req.body;

	if (!title || !content) {
		return res.status(400).json({ error: "title and content are required" });
	}

	try {
		const { data, error } = await supabase
			.from("posts")
			.insert([{ title, content, author_name }])
			.select()
			.single();

		if (error) {
			console.error("Supabase error creating post:", error.message);
			return res.status(500).json({ error: error.message });
		}

		res.status(201).json(data);
	} catch (err) {
		console.error("Unexpected error creating post:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Update a Post
 *
 * Generic endpoint to update any fields of a post
 *
 * * Request Body: Any fields to update
 *
 * Response: The updated post object
 */
// app.patch("/posts/:id", async (req: Request, res: Response) => {
// 	const { id } = req.params;
// 	const updates = req.body;

// 	try {
// 		const { data, error } = await supabase
// 			.from("posts")
// 			.update(updates)
// 			.eq("id", id)
// 			.select()
// 			.single();

// 		if (error) {
// 			console.error(`Error updating post ${id}:`, error.message);
// 			return res.status(500).json({ error: error.message });
// 		}

// 		if (!data) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		res.json(data);
// 	} catch (err) {
// 		console.error("Unexpected error updating post:", err);
// 		res.status(500).json({ error: String(err) });
// 	}
// });

/**
 * Upvote a Post
 *
 * Increments the vote count of a post by 1
 *
 *
 * How it works:
 * 1. Fetches the current vote count of the post
 * 2. Increments it by 1
 * 3. Updates the post with the new vote count
 *
 * Response: The updated post object with new vote count
 */
app.patch("/posts/:id/upvote", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { data: post, error: fetchError } = await supabase
			.from("posts")
			.select("votes")
			.eq("id", id)
			.single();

		if (fetchError || !post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const newVoteCount = (post.votes || 0) + 1;

		const { data: updatedPost, error: updateError } = await supabase
			.from("posts")
			.update({ votes: newVoteCount })
			.eq("id", id)
			.select()
			.single();

		if (updateError) {
			console.error(`Error upvoting post ${id}:`, updateError.message);
			return res.status(500).json({ error: updateError.message });
		}

		res.json(updatedPost);
	} catch (err) {
		console.error("Unexpected error upvoting post:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Mark Post as Answered
 *
 * Sets the is_answered flag to true, indicating the question has been answered
 *
 * Response: The updated post object with is_answered = true
 */
app.patch("/posts/:id/answered", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { data: post, error } = await supabase
			.from("posts")
			.update({ is_answered: true })
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error(`Error marking post ${id} as answered:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.json(post);
	} catch (err) {
		console.error("Unexpected error marking post as answered:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Delete a Post
 *
 * Removes a post and all associated replies from the database
 *
 * Response: No content (just confirms deletion)
 */
app.delete("/posts/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { error } = await supabase.from("posts").delete().eq("id", id);

		if (error) {
			console.error(`Error deleting post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		res.status(204).send();
	} catch (err) {
		console.error("Unexpected error deleting post:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Add a Reply to a Post
 *
 * Creates a new reply/comment on an existing post
 *
  
 *
 * Request Body:
 * {
 *   content: string (required) - The reply text,
 *   author_name: string (optional) - Name of the person replying
 * }
 *
 * Response: The newly created reply object
 * {
 *   id: string (UUID),
 *   post_id: string,
 *   content: string,
 *   author_name: string,
 *   created_at: timestamp
 * }
 */
app.post("/posts/:id/replies", async (req: Request, res: Response) => {
	const { id } = req.params;
	const { content, author_name } = req.body;

	if (!content) {
		return res.status(400).json({ error: "Reply content is required" });
	}

	try {
		const { data: reply, error } = await supabase
			.from("replies")
			.insert([{ post_id: id, content, author_name }])
			.select()
			.single();

		if (error) {
			console.error(`Error adding reply to post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		res.status(201).json(reply);
	} catch (err) {
		console.error("Unexpected error adding reply:", err);
		res.status(500).json({ error: String(err) });
	}
});

/**
 * Fetch All Replies for a Post
 *
 * Retrieves all replies/comments for a specific post
 *
 *
 * Response: Array of reply objects
 * {
 *   id: string (UUID),
 *   post_id: string,
 *   content: string,
 *   author_name: string,
 *   created_at: timestamp
 * }
 *
 */
app.get("/posts/:id/replies", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { data: replies, error } = await supabase
			.from("replies")
			.select("*")
			.eq("post_id", id)
			.order("created_at", { ascending: true });

		if (error) {
			console.error(`Error fetching replies for post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		res.json(replies || []);
	} catch (err) {
		console.error("Unexpected error fetching replies:", err);
		res.status(500).json({ error: String(err) });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
