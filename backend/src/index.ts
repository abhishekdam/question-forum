import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import supabase from "./supabaseClient.js";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = 4000;

// --- 1. Health Check Route ---
app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

// --- 2. GET /posts: Fetch all posts (NOW INCLUDES REPLY COUNT) ---
app.get("/posts", async (_req: Request, res: Response) => {
	try {
		// 1. Fetch all post columns ('*') and embed the count from the 'replies' table.
		// The resulting data structure for replies will be: [{ count: N }]
		const { data, error } = await supabase
			.from("posts")
			.select("*, replies(count)")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase error fetching posts:", error.message);
			return res.status(500).json({ error: error.message });
		}

		// 2. Map the data to clean up the response and present a single 'reply_count' property.
		const postsWithReplyCount = data?.map((post) => {
			// Extract the count from the nested array structure [ { count: N } ]
			const replyCount = post.replies?.[0]?.count || 0;

			// Create a new post object, excluding the temporary 'replies' array
			const { replies, ...postWithoutReplies } = post;

			return {
				...postWithoutReplies,
				reply_count: replyCount,
			};
		});

		res.json(postsWithReplyCount || []);
	} catch (err) {
		console.error("Unexpected error in GET /posts:", err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 3. POST /posts: Create a new post ---
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
			console.error("Supabase error inserting post:", error.message);
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json(data);
	} catch (err) {
		console.error("Unexpected error in POST /posts:", err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 4. PATCH /posts/:id: Generic Update ---
app.patch("/posts/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const updates = req.body;

	try {
		const { data, error } = await supabase
			.from("posts")
			.update(updates)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error(`Supabase error updating post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		if (!data) {
			return res.status(404).json({ error: `Post with ID ${id} not found.` });
		}

		res.json(data);
	} catch (err) {
		console.error("Unexpected error in PATCH /posts/:id:", err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 4.1. PATCH /posts/:id/upvote: Increment votes by 1 ---
app.patch("/posts/:id/upvote", async (req: Request, res: Response) => {
	const postId = req.params.id;

	try {
		// 1. Fetch current votes count
		const { data: postData, error: fetchError } = await supabase
			.from("posts")
			.select("votes")
			.eq("id", postId)
			.single();

		if (fetchError || !postData) {
			return res
				.status(404)
				.json({ error: `Post with ID ${postId} not found or fetch failed.` });
		}

		// Safely calculate new vote count
		const newVotes = (postData.votes || 0) + 1;

		// 2. Update the votes column
		const { data: updatedData, error: updateError } = await supabase
			.from("posts")
			.update({ votes: newVotes })
			.eq("id", postId)
			.select()
			.single();

		if (updateError) {
			console.error(
				`Supabase error upvoting post ${postId}:`,
				updateError.message
			);
			return res.status(500).json({ error: updateError.message });
		}

		res.json(updatedData);
	} catch (err) {
		console.error(`Unexpected error in PATCH /posts/${postId}/upvote:`, err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 4.2. PATCH /posts/:id/answered: Mark post as answered ---
app.patch("/posts/:id/answered", async (req: Request, res: Response) => {
	const postId = req.params.id;

	try {
		// Update the is_answered column to true
		const { data, error } = await supabase
			.from("posts")
			.update({ is_answered: true })
			.eq("id", postId)
			.select()
			.single();

		if (error) {
			console.error(
				`Supabase error marking post ${postId} as answered:`,
				error.message
			);
			return res.status(500).json({ error: error.message });
		}

		if (!data) {
			return res
				.status(404)
				.json({ error: `Post with ID ${postId} not found.` });
		}

		res.json(data);
	} catch (err) {
		console.error(`Unexpected error in PATCH /posts/${postId}/answered:`, err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 5. DELETE /posts/:id: Delete a post ---
app.delete("/posts/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { error } = await supabase.from("posts").delete().eq("id", id);

		if (error) {
			console.error(`Supabase error deleting post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		// 204 No Content is the standard response for successful DELETE
		res.status(204).send();
	} catch (err) {
		console.error("Unexpected error in DELETE /posts/:id:", err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 6. POST /posts/:id/replies: Create a reply for a post ---
app.post("/posts/:id/replies", async (req: Request, res: Response) => {
	const postId = req.params.id;
	const { content, author_name } = req.body;

	if (!content) {
		return res.status(400).json({ error: "Content is required for a reply" });
	}

	try {
		const { data, error } = await supabase
			.from("replies")
			.insert([{ post_id: postId, content, author_name }])
			.select()
			.single();

		if (error) {
			console.error(
				`Supabase error inserting reply for post ${postId}:`,
				error.message
			);
			return res.status(500).json({ error: error.message });
		}

		res.status(201).json(data);
	} catch (err) {
		console.error(`Unexpected error in POST /posts/${postId}/replies:`, err);
		res.status(500).json({ error: String(err) });
	}
});

// --- 7. GET /posts/:id/replies: Fetch all replies for a post ---
app.get("/posts/:id/replies", async (req: Request, res: Response) => {
	const postId = req.params.id;

	try {
		const { data, error } = await supabase
			.from("replies")
			.select("*")
			.eq("post_id", postId)
			.order("created_at", { ascending: true });

		if (error) {
			console.error(
				`Supabase error fetching replies for post ${postId}:`,
				error.message
			);
			return res.status(500).json({ error: error.message });
		}

		res.json(data || []);
	} catch (err) {
		console.error(`Unexpected error in GET /posts/${postId}/replies:`, err);
		res.status(500).json({ error: String(err) });
	}
});

// --- Server Listener ---
app.listen(PORT, () => {
	console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
