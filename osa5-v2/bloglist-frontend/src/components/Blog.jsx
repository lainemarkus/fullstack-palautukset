import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  console.log('Blog component re-rendered')
  console.log('User Prop:', blog.user)
  const [showInfo, setShowInfo] = useState(false)


  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: '1rem',
    borderWidth: 1,
    border: '1px solid #aaaaaa',
    borderRadius: '5px',
    backgroundColor: '#eaeaea',
    boxShadow: '#434343',

    marginBottom: 5
  }

  const handleLike = async () => {
    try {

      updateLikes(blog.id, blog.likes + 1)

    }

    catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }


  return (
    <div style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author}
        <button onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'hide' : 'view'}
        </button>
      </div>
      {showInfo && (
        <div>
          <p><a href={'https://' + blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
          <p>likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>Added by {blog.user.name}</p>
          {(user && user.username === blog.user.username) && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}


export default Blog

