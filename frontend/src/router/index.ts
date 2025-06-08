import { createRouter, createWebHistory } from 'vue-router'
import ArtistView from '../views/ArtistView.vue'
import AlbumsView from '../views/AlbumsView.vue'
import SongsView from '../views/SongsView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import LoginView from '@/views/LoginView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      
    },
    {
      path: '/artists',
      name: 'artists',
      component: ArtistView,
      meta: { requiresAuth: true }
    },
    {
      path: '/albums/:id',
      name: 'albums',
      component: () => AlbumsView,
      props: true,
      meta: { requiresAuth: true }

    },
    {
      path: '/songs/:id',
      name: 'songs',
      component: () => SongsView,
      props: true,
      meta: { requiresAuth: true }

    },
    { path: '/login', 
      name: 'login', 
      component: LoginView },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
