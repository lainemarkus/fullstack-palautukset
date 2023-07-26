
const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, post) => sum + post.likes, 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikedBlog = blogs.reduce((prevBlog, currentBlog) => {
    return currentBlog.likes > prevBlog.likes ? currentBlog : prevBlog
  })

  return mostLikedBlog
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCount = lodash.countBy(blogs, 'author')

  const topAuthor = Object.keys(blogCount).reduce((a, b) => {
    return blogCount[a] > blogCount[b] ? a : b
  })

  return {
    author: topAuthor,
    blogs: blogCount[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsByAuthor = lodash.groupBy(blogs, 'author')

  const likesByAuthor = lodash.mapValues(blogsByAuthor, (authorBlogs) =>
    lodash.sumBy(authorBlogs, 'likes'))

  const mostLikedAuthor = lodash.maxBy(lodash.toPairs(likesByAuthor), (pair) => pair[1])

  const [authorName, totalLikes] = mostLikedAuthor

  return { author: authorName, likes: totalLikes }
}






module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}