import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import './App.css'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', true)
      setTimeout(() => {
        showNotification(null)
      }, 5000)
    }
  }

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      const updatedBlogs = [...blogs, returnedBlog]
      setBlogs(updatedBlogs)
      showNotification('Blog added successfully!', false)

    } catch (error) {
      showNotification('Error adding blog.', true)
      console.error('Error adding blog:', error)
    }
  }

  const updateLikes = async (id, updatedLikes) => {
    try {
      const updatedBlog = await blogService.update(id, { likes: updatedLikes })
      console.log('Updated Blog:', updatedBlog)
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? updatedBlog : blog))
      )
    } catch (error) {
      setNotification('error', error.response.data.error)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const removeBlog = async (id) => {
    console.log(id)
    try {
      const status = await blogService.remove(id)

      if (status === 204) {
        const updatedBlogs = blogs.filter((blog) => blog.id !== id)
        setBlogs(updatedBlogs)
        showNotification('Blog removed', false)
      } else {
        showNotification('Error removing blog', true)
      }
    } catch (error) {
      showNotification('Error removing blog', true)
      console.error('Error removing blog:', error)
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef} >
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )



  return (
    <div>

      <Notification message={notification ? notification.message : null} isError={notification ? notification.isError : false} />
      {!user ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      ) : (
        <div>
          <h1>Blogs</h1>
          <p>{user.name} logged in</p>
          <button id="logoutButton" onClick={handleLogout}>
            logout
          </button>
          {blogForm()}

          <div>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateLikes={updateLikes}
                removeBlog={removeBlog}
              />
            )}
          </div>
        </div>
      )}

    </div>
  )

}

export default App

