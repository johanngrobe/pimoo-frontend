import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })
)

export default apiClient
