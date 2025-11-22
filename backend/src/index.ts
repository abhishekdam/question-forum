import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import supabase from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

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
			console.error(`Error updating post ${id}:`, error.message);
			return res.status(500).json({ error: error.message });
		}

		if (!data) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.json(data);
	} catch (err) {
		console.error("Unexpected error updating post:", err);
		res.status(500).json({ error: String(err) });
	}
});

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
