import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { authenticate } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'book/:id',
          name: 'Book',
          component: () => import('../views/BookView.vue'),
        },
        {
          path: 'create/book',
          name: 'CreateBook',
          component: () => import('../views/CreateBookView.vue'),
        },
        {
          path: 'create/school',
          name: 'CreateSchool',
          component: () => import('../views/CreateSchoolView.vue'),
        },
        {
          path: 'reservation',
          name: 'Reservations',
          component: () => import('../views/ReservationView.vue'),
        },
        {
          path: 'create/librarian',
          name: 'CreateLibrarian',
          component: () => import('../views/SignupView.vue'),
        },
      ],
    },
    {
      path: '',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignupView.vue'),
    },
  ],
})

export default router
