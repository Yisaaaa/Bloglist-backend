const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const blogRouter = require("./controllers/blog");
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
app.use("/api/blogs", blogRouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
