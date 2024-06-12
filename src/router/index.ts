import { createRouter, createWebHistory } from 'vue-router';
import IntroPage from '../components/IntroPage.vue';
import GamePage from '../components/DinoGame.vue';

const routes = [
  {
    path: '/',
    name: 'Intro',
    component: IntroPage,
  },
  {
    path: '/game',
    name: 'Game',
    component: GamePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
