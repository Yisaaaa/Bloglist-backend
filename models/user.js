const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
	name: String,
	passwordHash: String,
});

userSchema.set("toJSON", {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj.__v;
		delete returnedObj._id;
		delete returnedObj.passwordHash;
	},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
