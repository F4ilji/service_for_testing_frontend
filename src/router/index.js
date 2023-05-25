import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/tests/:id',
    name: 'testPage',
    component: () => import('../views/TestPage.vue')
    
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/:id',
    name: 'dashboardQuest',
    component: () => import(/* webpackChunkName: "about" */ '../views/DashboardQuestPage.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard/:testId/question/:questId',
    name: 'dashboardAnswer',
    component: () => import(/* webpackChunkName: "about" */ '../views/DashboardAnswerPage.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginPage.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { requiresAuth: true }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
