import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/page1',
    },
    {
      path: '/page1',
      name: 'page1',
      component: (resolve) => require(['./pages/page1.vue'], resolve),
      meta: { title: 'page1' },
    },
    {
      path: '/page2',
      name: 'page2',
      component: (resolve) => require(['./pages/page2.vue'], resolve),
      meta: { title: 'page2' },
    },
    {
      path: '/page3',
      name: 'page3',
      component: (resolve) => require(['./pages/page3.vue'], resolve),
      meta: { title: 'page3' },
    },
  ],
});

export default router;
