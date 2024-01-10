const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});
	response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;

	const users = await User.find({});

	const user = users[0];

	if (!request.body.title || !request.body.url) {
		return response
			.status(400)
			.json({ error: "missing title or url property" });
	}

	let newBlog = {
		...body,
		user: user._id,
		likes: body.likes ? body.likes : 0,
	};

	newBlog = await new Blog(newBlog).save();

	user.blogs = user.blogs.concat(newBlog._id);

	await user.save();

	return response.status(201).json(newBlog);
});

blogRouter.delete("/:id", async (request, response) => {
	const id = request.params.id;
	await Blog.findByIdAndDelete(id);
	response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});

	response.json(updatedBlog);
});
module.exports = blogRouter;
