const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;

	if (!request.body.title || !request.body.url) {
		return response
			.status(400)
			.json({ error: "missing title or url property" });
	}

	let newBlog = { ...body, likes: body.likes ? body.likes : 0 };
	newBlog = await new Blog(newBlog).save();
	response.status(201).json(newBlog);
});

module.exports = blogRouter;
