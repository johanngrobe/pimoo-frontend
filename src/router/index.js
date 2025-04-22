import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/verify-account',
      name: 'verify-account',
      component: () => import('@/views/auth/VerifyAccountView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue')
    },
    {
      path: '/mobility-check/edit/:mobilitySubmissionId',
      name: 'edit-mobility-check',
      component: () => import('../views/authRequired/MobilitySubmissionEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mobility-check/new',
      name: 'new-mobility-check',
      component: () => import('../views/authRequired/MobilitySubmissionNewView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/new-climate-check',
      name: 'new-climate-check',
      component: () => import('@/views/authRequired/NewClimateView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/my-history',
      name: 'my-history',
      component: () => import('@/views/authRequired/MyHistoryView.vue'),
      meta: {
        requiresAuth: true,
        forRoles: ['politician']
      }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/authRequired/HistoryView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/authRequired/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/authRequired/SettingsView.vue'),
      meta: {
        requiresAuth: true,
        requiredUserRole: ['administration']
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      // Redirect to login if the user is not authenticated
      next({ name: 'login' })
    }
    if (to.meta.requiredUserRole && !to.meta.requiredUserRole.includes(authStore.userRole)) {
      // Check if user has the required role(s) for this route
      next({ name: 'not-authorized' }) // or redirect to a 403 page
    } else {
      // Allow access if authenticated and has required role(s)
      next()
    }
  } else {
    // Allow access if no authentication is required
    next()
  }
})

export default router
