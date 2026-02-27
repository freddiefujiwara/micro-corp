import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from './App.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:token?',
      name: 'home',
      component: AppLayout
    }
  ]
});

export default router;
