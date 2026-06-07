import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/Landing.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/views/Callback.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/top-artists',
    name: 'TopArtists',
    component: () => import('@/views/TopArtists.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/top-tracks',
    name: 'TopTracks',
    component: () => import('@/views/TopTracks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recent',
    name: 'Recent',
    component: () => import('@/views/Recent.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/artist/:id',
    name: 'ArtistDetail',
    component: () => import('@/views/ArtistDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Landing' }
  }
  if (to.name === 'Landing' && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
