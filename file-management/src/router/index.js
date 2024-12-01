import { createRouter, createWebHistory } from 'vue-router'
import authMiddleware from '@/middleware/auth'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MyFilesView from '@/views/MyFilesView.vue'
import PublicFileView from '@/views/PublicFileView.vue'
import SharedFileView from '@/views/SharedFileView.vue'


const routes = [
  {
    path: '/',
    redirect: '/login', 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/files',
    name: 'MyFiles',
    component: MyFilesView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/files/public',
    name: 'PublicFiles',
    component: PublicFileView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/files/shared-files',
    name: 'SharedFiles',
    component: SharedFileView,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/:pathMatch(.*)*', 
    redirect: '/login', 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authMiddleware)

export default router
