// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AdminView from '@/views/AdminView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/login', 
    name: 'Login', 
    component: LoginView 
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
