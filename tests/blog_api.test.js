const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

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
];

beforeEach(async () => {
	await Blog.deleteMany();
	await User.deleteMany();
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
	let token;

	beforeEach(async () => {
		const newUser = { username: "luis", name: "luis", password: "secret" };

		await api.post("/api/users").send(newUser);
		const user = await api.post("/api/login").send(newUser);

		token = `Bearer ${user.body.token}`;
	});

	test("a new blog can be added", async () => {
		const newBlog = {
			title: "Why the Earth is round and keeps on rounding",
			author: "Mad Scientist",
			url: "http://madscience.com",
			likes: 17891,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", token)
			.expect(201);

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
			.set("Authorization", token)
			.expect(201);

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

		await api
			.post("/api/blogs")
			.send(blogWithNoUrl)
			.set("Authorization", token)
			.expect(400);

		await api
			.post("/api/blogs")
			.send(blogWithNoTitle)
			.set("Authorization", token)
			.expect(400);
	}, 100000);

	test("adding a blog without token is not allowed", async () => {
		const blog = {
			title: "This request has no token provided",
			author: "Mad Scientist",
			url: "someurl",
			likes: 17891,
		};

		await api.post("/api/blogs").send(blog).expect(401);
	}, 10000);
});

describe("deletion of an specific blog", () => {
	let token;

	beforeEach(async () => {
		const newUser = {
			username: "luis",
			name: "luis",
			password: "secret",
		};
		await api.post("/api/users").send(newUser);
		const user = await api.post("/api/login").send(newUser);

		token = `Bearer ${user.body.token}`;
	});

	test("a blog can be deleted", async () => {
		let newBlog = {
			title: "Why the Earth is round and keeps on rounding",
			author: "Mad Scientist",
			url: "http://madscience.com",
		};

		newBlog = await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", token)
			.expect(201);

		await api
			.delete(`/api/blogs/${newBlog.body.id}`)
			.set("Authorization", token);

		const blogTitles = (await Blog.find({})).map((blog) => blog.title);

		expect(blogTitles).not.toContain(`${newBlog.title}`);
	});
});

describe("updating a note", () => {
	test("a blog can be updated", async () => {
		const blogToUpdate = (await Blog.find({}))[0].toJSON();
		const newBlog = {
			...blogToUpdate,
			likes: 9999,
		};

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(newBlog)
			.expect(200);

		const updatedBlog = await Blog.findById(blogToUpdate.id);
		expect(updatedBlog.likes).toBe(newBlog.likes);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
