const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const userExtractor = require("../utils/middleware").userExtractor;

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});
	response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
	if (!request.body.title || !request.body.url) {
		return response
			.status(400)
			.json({ error: "missing title or url property" });
	}

	// const token = request.token;
	// const decodedToken = jsonwebtoken.decode(token, process.env.SECRET);

	// if (!decodedToken) {
	// 	return response.status(401).json({ error: "token invalid" });
	// }

	// const user = await User.findById(decodedToken.id);

	// if (!user) {
	// 	return response.status(401).json({ eror: "invalid user" });
	// }

	const body = request.body;
	const user = request.user;

	let newBlog = {
		...body,
		user: user._id,
		likes: body.likes ? body.likes : 0,
	};

	newBlog = await new Blog(newBlog).save();

	await newBlog.populate("user", {
		username: 1,
		name: 1,
	});

	user.blogs = user.blogs.concat(newBlog._id);

	await user.save();

	return response.status(201).json(newBlog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
	// const token = request.token;
	// const decodedToken = jsonwebtoken.decode(token, process.env.SECRET);

	// if (!decodedToken) {
	// 	return response.status(401).json({ error: "token invalid" });
	// }

	// const user = await User.findById(decodedToken.id);

	const user = request.user;
	const blog = await Blog.findById(request.params.id);

	if (user._id.toString() !== blog.user.toString()) {
		return response.status(401).json({ error: "invalid user" });
	}

	await blog.delete();
	return response.status(204).end();

	// const id = request.params.id;
	// await Blog.findByIdAndDelete(id);
	// response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: body.user,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});

	await updatedBlog.populate("user", {
		username: 1,
		name: 1,
	});

	response.json(updatedBlog);
});

module.exports = blogRouter;
