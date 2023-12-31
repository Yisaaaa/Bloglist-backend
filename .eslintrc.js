/* eslint-disable no-tabs */
module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: "airbnb-base",
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		indent: ["error", "tab"],
		quotes: ["error", "double"],
		"no-tabs": 0,
		"no-console": 0,
		"prefer-destructuring": 0,
	},
};
