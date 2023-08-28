import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.log('Server responded with status code', error.response.status)
      } else if (error.request) {
        console.log('No response received from the server')
      } else {
        console.log('Error occurred:', error.message)
      }
    })
}


const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }


  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
    .catch(error => {
      if (error.response) {
        console.error('Server responded with status:', error.response.status)
        console.error('Error data:', error.response.data)
      } else if (error.request) {
        console.error('No response received from server')
      } else {
        console.error('Error while setting up the request:', error.message)
      }
      throw error
    })
}


const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  const response = await request
  return response.status
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const updateLikes = (id, newLikes) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(`${baseUrl}/${id}`, { likes: newLikes }, config)
  return request.then(response => response.data)
}
export default {
  getAll,
  create,
  update,
  remove,
  updateLikes,
  setToken
}