const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => {
		return sum + blog.likes;
	}, 0);
};

const favoriteBlog = (blogs) => {
	const reducer = (favorite, currentBlog) => {
		if (currentBlog.likes > favorite.likes) {
			return currentBlog;
		}
		return favorite;
	};

	return blogs.length === 0 ? null : blogs.reduce(reducer, blogs[0]);
};

module.exports = { dummy, totalLikes, favoriteBlog };
