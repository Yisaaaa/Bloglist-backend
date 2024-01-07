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

	await Promise.all(
		initialBlogs.map(async (blog) => {
			const newBlog = new Blog(blog);
			await newBlog.save();
		})
	);
});

describe("when there are initial blogs that are saved", () => {
	test("all blogs are returned", async () => {
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(initialBlogs.length);
	}, 100000);

	test("blog has a unique identifier property named 'id'", async () => {
		const response = await api.get("/api/blogs");

		expect(response.body[0].id).toBeDefined();
	});
});

describe("addition of a new blog", () => {
	test("a new blog can be added", async () => {
		const newBlog = {
			title: "Why the Earth is round and keeps on rounding",
			author: "Mad Scientist",
			url: "http://madscience.com",
			likes: 17891,
		};

		await api.post("/api/blogs").send(newBlog).expect(201);

		const blogsAfterAdding = await Blog.find({});
		const titles = blogsAfterAdding.map((blog) => blog.title);

		expect(blogsAfterAdding).toHaveLength(initialBlogs.length + 1);
		expect(titles).toContain(
			"Why the Earth is round and keeps on rounding"
		);
	});

	test("a new blog with no likes property will have a default value of 0", async () => {
		const blogWithNoLikes = {
			title: "Why the Earth is round and keeps on rounding",
			author: "Mad Scientist",
			url: "http://madscience.com",
		};

		const savedBlog = await api
			.post("/api/blogs")
			.send(blogWithNoLikes)
			.expect(201);

		console.log(savedBlog.body);
		expect(savedBlog.body.likes).toBeDefined();
		expect(savedBlog.body.likes).toBe(0);
	});

	test("a blog with no title or url is a bad request", async () => {
		const blogWithNoUrl = {
			title: "Why the Earth is round and keeps on rounding",
			author: "Mad Scientist",
			likes: 17891,
		};

		const blogWithNoTitle = {
			author: "Mad Scientist",
			url: "http://madscience.com",
			likes: 17891,
		};

		await api.post("/api/blogs").send(blogWithNoUrl).expect(400);
		await api.post("/api/blogs").send(blogWithNoTitle).expect(400);
	}, 100000);
});

afterAll(async () => {
	await mongoose.connection.close();
});
