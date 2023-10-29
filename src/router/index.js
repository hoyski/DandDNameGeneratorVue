import { createRouter as _createRouter, createWebHistory } from 'vue-router';

import TavernsView from '../views/TavernsView.vue';
import MagicShopsView from '../views/MagicShopsView.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'taverns' }
  },
  {
    path: '/taverns',
    name: 'taverns',
    component: TavernsView
  },
  {
    path: '/magicShops',
    name: 'magicShops',
    component: MagicShopsView
  }
];

export function createRouter () {
  return _createRouter({
    history: createWebHistory(),
    routes: routes
  })
}
