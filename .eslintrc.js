/* eslint-disable no-tabs */
module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		jest: true,
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
		indent: 0,
		quotes: ["error", "double"],
		"no-tabs": 0,
		"no-console": 0,
		"prefer-destructuring": 0,
		"no-underscore-dangle": 0,
		"arrow-body-style": 0,
		"no-mixed-spaces-and-tabs": 0,
		"comma-dangle": 0,
		"import/no-extraneous-dependencies": 0,
		"no-param-reassign": 0,
		"no-else-return": 0,
		"operator-linebreak": 0,
		"global-require": 0,
	},
};
