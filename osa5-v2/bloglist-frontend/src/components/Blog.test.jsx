import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'





describe('Blog component', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://www.example.com',
    likes: 10,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'User',
    token: 'token'
  }

  test('renders title and author', () => {
    render(<Blog blog={blog} />)

    const mockHandler = jest.fn()
    const titleElement = screen.getByText('Test Blog')
    const authorElement = screen.getByText('by Test Author')

    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()

  })

  test('does not render URL and like count by default', () => {
    render(<Blog blog={blog} />)

    const urlElement = screen.queryByText('https://www.example.com')
    const likeCountElement = screen.queryByText('likes: 10')

    expect(urlElement).toBeNull()
    expect(likeCountElement).toBeNull()
  })


  test('renders all information after view button is clicked', () => {
    render(<Blog blog={blog} />)

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    const urlElement = screen.getByText('https://www.example.com')
    const likeCountElement = screen.getByText('likes: 10')
    const userElement = screen.getByText('Added by Test User')

    expect(urlElement).toBeInTheDocument()
    expect(likeCountElement).toBeInTheDocument()
    expect(userElement).toBeInTheDocument()
  })

  test('calls the updateLikes function twice when like button is clicked twice', () => {
    const mockUpdateLikes = jest.fn()
    render(<Blog blog={blog} updateLikes={mockUpdateLikes} />)

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockUpdateLikes).toHaveBeenCalledTimes(2)
  })

})