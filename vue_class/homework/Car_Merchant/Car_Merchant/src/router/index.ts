import { createRouter, createWebHistory } from 'vue-router'
import Home_hero_page from '@/components/Home_hero_page.vue'
import Rent_page from '@/components/Rent_page.vue'


const routes = [
  {
    path: '/',
    name: 'Home_page',
    component: Home_hero_page
  },
  {
    path: '/rent_page',
    name: 'Rent_page',
    component: Rent_page
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
