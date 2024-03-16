const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		title: 1,
		url: 1,
		author: 1,
	});

	response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
	const id = request.params.id;
	const user = await User.findById(id).populate("blogs", {
		title: 1,
		url: 1,
		author: 1,
	});

	response.json(user);
});

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body;

	if (password.length < 3) {
		response
			.status(400)
			.json({ error: "password should be at least 3 characters long" });
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.status(201).json(savedUser);
});

module.exports = usersRouter;
