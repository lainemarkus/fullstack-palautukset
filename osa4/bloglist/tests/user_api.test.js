const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./helper')




describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'makewave',
      name: 'Make Laine',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'failaaja',
      name: 'Eimee Läpi'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails if password is less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'failaaja',
      name: 'Eimee Läpi',
      password: 'yx'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Anonyymi',
      password: 'salaisuus'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails if username is invalid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ma',
      name: 'Anonyymi',
      password: 'salaisuus'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    console.log(result.body.error)
    expect(result.body.error).toContain('Username must be at least 3 characters long')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })


})

afterAll(async () => {
  await mongoose.connection.close()
})
