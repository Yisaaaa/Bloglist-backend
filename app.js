const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const userRouter = require("./controllers/user");
const blogRouter = require("./controllers/blog");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");

const app = express();

mongoose.set("toJSON", {
	transform: (request, response) => {
		response.id = response._id.toString();
		delete response._id;
		delete response.__v;
	},
});

const mongoUrl = config.MONGODB_URI;
mongoose
	.connect(mongoUrl)
	.then(() => logger.info("Succesfully connected to MongoDB"))
	.catch((error) => logger.error("Failed connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

if (process.env.NODE_ENV === "test") {
	const testingRouter = require("./controllers/testing");
	app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
