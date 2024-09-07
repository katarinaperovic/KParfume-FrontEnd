import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import FabrikeView from '../views/FabrikeView.vue';
import UsersView from '../views/UsersView.vue';
import VestiView from '../views/VestiView.vue';
import OceneView from '../views/OceneView.vue';
import KuponiView from '../views/KuponiView.vue';
import NewsDetailView from '../views/NewsDetailView.vue';

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
    path: '/vest/:id',
    name: 'NewsDetail',
    component: NewsDetailView,
    props: true
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
  },
  {
    path: '/vesti',
    name: 'vesti',
    component: VestiView
  },
  {
    path: '/ocene',
    name: 'ocene',
    component: OceneView
  },
  {
    path: '/kuponi',
    name: 'kuponi',
    component: KuponiView
  }
  
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;