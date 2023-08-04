const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
require('express-async-errors')
const Blog = require('../models/blog')
const helper = require('./helper')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('blog identifier is called "id"', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(blog => blog.id)
    for (const id of ids) {
      expect(id).toBeDefined()}
  })

})

describe('POST api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('success with valid data', async () => {

    const newBlog = {
      title: 'Karvaiset otukset',
      author: 'Karvaturri',
      url: 'www.karvakasa.fi',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const updatedBlogs = await helper.blogsInDb()

    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)

  })

  test('likes are set to 0 if not specified', async () => {
    const newBlog = {
      title: 'Where are my likes?',
      author: 'Nobody likes me',
      url: 'www.foreveralone.com',
    }

    const createResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const getResponse = await api.get(`/api/blogs/${createResponse.body.id}`)

    expect(getResponse.body.likes).toEqual(0)


  })


  test('fails with status code 400 if url missing', async () => {
    const newBlog = {
      title: 'invalid blog',
      author: 'Url Misser',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)


    const BlogsAtEnd = await helper.blogsInDb()

    expect(BlogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('fails with status code 400 if title missing', async () => {
    const newBlog = {
      author: 'Title Misser',
      url: 'wwww.missingtitle.com',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const BlogsAtEnd = await helper.blogsInDb()

    expect(BlogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('DELETE api/blogs', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)
  })


})


describe('PUT api/blogs', () => {

  test('succeeds with status 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 90 })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(updatedBlog.likes).toBe(90)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})
