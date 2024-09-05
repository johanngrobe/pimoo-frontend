import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

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
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue')
    },
    {
      path: '/new-mobility-check',
      name: 'new-mobility-check',
      component: () => import('@/views/authRequired/NewMobilityView.vue'),
      meta: {
        requiresAuth: true
      }
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
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth) {
    next()
  } else {
    next()
  }
})

export default router
