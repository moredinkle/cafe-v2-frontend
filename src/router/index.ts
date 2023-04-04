import { createRouter, createWebHistory } from 'vue-router'
import MenuListView from '../views/MenuListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menus',
      component: MenuListView
    },
    {
      path: '/menus',
      name: 'menus',
      component: MenuListView
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: MenuListView
    },
    {
      path: '/menus/:id_menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    }
  ]
})

export default router
