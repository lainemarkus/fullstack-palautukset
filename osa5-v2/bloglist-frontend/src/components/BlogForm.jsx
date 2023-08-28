
import { useState } from 'react'


const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }


  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            id="title"
            value={newBlog.title}
            type="text"
            name="title"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            value={newBlog.author}
            type="text"
            name="author"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            id="url"
            value={newBlog.url}
            type="text"
            name="url"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm

