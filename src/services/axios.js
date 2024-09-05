import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL:
      import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BACKEND_URL
        : 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json'
    }
  })
)

export default apiClient
