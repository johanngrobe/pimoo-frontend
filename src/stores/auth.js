import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import apiClient from '@/services/axios'
import { useRouter } from 'vue-router'
// import { useCookies } from '@vueuse/integrations/useCookies'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoggedIn = useStorage('isLoggedIn', false) // persist user in localStorage
    const loading = ref(false)

    const userRole = useStorage('userRole', 'none') // persist user role in localStorage

    const router = useRouter()

    async function register(data) {
      loading.value = true
      await apiClient.post('/auth/register', data)
      await apiClient.post('/auth/request-verify-token', { email: data.email })
      loading.value = false
    }

    async function login({ email, password }) {
      loading.value = true

      const formData = new FormData()
      formData.set('username', email)
      formData.set('password', password)

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 204) {
        isLoggedIn.value = true // Set logged-in status if successful
        const user = await getUser()
        userRole.value = user.role
        router.replace({ name: 'history', query: { tab: 'mobility-check' } })
      } else {
        isLoggedIn.value = false
      }
      loading.value = false
    }

    async function logout() {
      try {
        loading.value = true

        await apiClient.post('/auth/logout')
        isLoggedIn.value = false
        userRole.value = null
        router.replace({ name: 'home' })
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading.value = false
      }
    }

    async function getUser() {
      try {
        const user = await apiClient.get('/users/me')
        return user.data
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
      }
    }

    apiClient.interceptors.response.use(
      (response) => response, // Pass through if response is successful
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle the 401 error: log out the user or redirect to login
          router.replace({ name: 'login', query: { redirect: 'sessionExpired' } })
          isLoggedIn.value = false
          userRole.value = null
        }
        // return Promise.reject(error) // Continue to reject the error to handle it locally if needed
      }
    )

    async function checkAuthStatus() {
      try {
        const response = await apiClient.get('/auth/status')
        if (response.status === 200) {
          isLoggedIn.value = true
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          isLoggedIn.value = false // Logs the user out if the session expired
          // Optionally redirect to login
        }
      }
    }

    // setInterval(checkAuthStatus, 300000) // Check every 5 minutes

    async function updateUser(data) {
      try {
        loading.value = true
        await apiClient.patch('/users/me', data)
        loading.value = false
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      }
    }

    async function forgotPassword(email) {
      try {
        loading.value = true
        await apiClient.post('/auth/forgot-password', { email })
        loading.value = false
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
      }
    }

    async function resetPassword(token, password) {
      try {
        loading.value = true
        await apiClient.post('/auth/reset-password', { token, password })
        loading.value = false
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
      }
    }

    return {
      loading,
      isLoggedIn,
      userRole,
      register,
      login,
      logout,
      checkAuthStatus,
      getUser,
      updateUser,
      forgotPassword,
      resetPassword
    }
  }
  // ,
  // {
  //   persist: {
  //     storage: sessionStorage,
  //     paths: ['authState']
  //   }
  // }
)
