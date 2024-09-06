import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import FabrikeView from '../views/FabrikeView.vue';
import UsersView from '../views/UsersView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registration',
    name: 'registration',
    component: AboutView
  },
  {
    path: '/fabrike',
    name: 'fabrike',
    component: FabrikeView,
    props: route => ({
      fabrike: route.meta.fabrike
    })
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;