const unknownEndpoint = (request, response) => {
	response.status(404).json({ error: "unknown endpoint" });
};

module.exports = { unknownEndpoint };
