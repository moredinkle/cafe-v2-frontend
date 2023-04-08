import { createRouter, createWebHistory } from 'vue-router';
import SalesView from '../views/SalesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sales',
      component: SalesView
    },
    {
      path: '/menus',
      name: 'menus',
      component: () => import('../views/MenuListView.vue')
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/SalesView.vue')
    },
    {
      path: '/menus/:id_menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    }
  ]
})

export default router
