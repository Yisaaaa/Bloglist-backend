const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const unknownEndpoint = (request, response) => {
	response.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({ error: error.message });
	}

	next(error);
};

const tokenExtractor = (request, response, next) => {
	const authorization = request.get("authorization");

	if (authorization && authorization.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "");
	}

	next();
};

const userExtractor = async (request, response, next) => {
	const token = request.token;
	const decodedToken = jwt.decode(token, process.env.SECRET);

	if (!decodedToken) {
		return response.status(401).json({ error: "token invalid" });
	}

	const user = await User.findById(decodedToken.id);

	if (!user) {
		return response.status(401).json({ error: "invalid user" });
	}

	request.user = user;

	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
