import { createRouter, createWebHistory } from 'vue-router';
import IntroPage from '../components/IntroPage.vue';
import GamePage from '../components/DinoGame.vue';

const routes = [
  {
    path: '/tg_dino/',
    name: 'Intro',
    component: IntroPage,
  },
  {
    path: '/tg_dino/game',
    name: 'Game',
    component: GamePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
