const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

const initialUsers = [
	{
		username: "Yisa",
		name: "Luis",
		password: "secret",
	},
	{
		username: "Joe",
		name: "Joe Biden",
		password: "secret",
	},
	{
		username: "Donald",
		name: "Donald Trump",
		password: "secret",
	},
];

beforeEach(async () => {
	await User.deleteMany();

	await Promise.all(
		initialUsers.map(async (user) => {
			const newUser = new User(user);

			await newUser.save();
		})
	);
});

describe("when there are initial users in the db", () => {
	test("all users are returned", async () => {
		const response = await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(initialUsers.length);
	}, 10000);
});

describe("addition of a new user", () => {
	test("username must be unique", async () => {
		const user = {
			username: "Joe",
			name: "not unique",
			password: "secret",
		};

		await api
			.post("/api/users")
			.send(user)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const users = await User.find({});

		expect(users).toHaveLength(initialUsers.length);
	});

	test("username and password must be at least 3 characters long", async () => {
		const twoCharUserName = {
			username: "Jo",
			name: "2 char username",
			password: "secret",
		};

		const userWith2CharPasswd = {
			username: "valid username",
			name: "but not password",
			password: "lo",
		};

		await api
			.post("/api/users")
			.send(twoCharUserName)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		await api
			.post("/api/users")
			.send(userWith2CharPasswd)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const users = await User.find({});

		expect(users).toHaveLength(initialUsers.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
