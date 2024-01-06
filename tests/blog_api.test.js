const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
	{
		title: "To pimp a butterfly",
		author: "Kendrick Lamar",
		url: "somerandomurl",
		likes: 12301,
	},
	{
		title: "Dark side of the moon",
		author: "Pink Floyd",
		url: "somerandomurl1",
		likes: 5431,
	},
	{
		title: "What the dog doin",
		author: "Unknown",
		url: "somerandomurl2",
		likes: 98573,
	},
];

beforeEach(async () => {
	await Blog.deleteMany();

	Promise.all(
		initialBlogs.map(async (blog) => {
			const newBlog = new Blog(blog);
			await newBlog.save();
		})
	);
});

test("all blogs are returned", async () => {
	const response = await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);

	expect(response.body).toHaveLength(initialBlogs.length);
});

afterEach(async () => {
	await mongoose.connection.close();
});
