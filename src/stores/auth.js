import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage, StorageSerializers } from '@vueuse/core'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = useStorage('user', null, localStorage, { serializer: StorageSerializers.object }) // persist user in localStorage
    const token = ref(null)
    const isAuthenticated = useStorage('isAuthenticated', false) // persist user in localStorage
    const loading = ref(false)

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session ? session.user : null
      isAuthenticated.value = session ? true : false
    })

    async function setUser() {
      const { data } = await supabase.auth.getSession()
      user.value = data?.session?.user || null
    }

    async function register({ email, password, meta }) {
      loading.value = true
      let { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta,
          redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL
        }
      })
      loading.value = false
      if (error) throw error
    }

    async function login({ email, password }) {
      loading.value = true
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      loading.value = false
      if (error) throw error
    }

    async function logout() {
      try {
        loading.value = true

        let { error } = await supabase.auth.signOut()

        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading.value = false
      }
    }

    async function updateUser(data) {
      try {
        loading.value = true
        let { error } = await supabase.auth.updateUser({
          ...data
        })
        loading.value = false
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      }
    }

    async function resetPassword(email) {
      try {
        loading.value = true
        let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL + '/reset-password'
        })
        console.log(data)
        loading.value = false
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      }
    }

    return {
      user,
      token,
      loading,
      setUser,
      isAuthenticated,
      register,
      login,
      logout,
      updateUser,
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
