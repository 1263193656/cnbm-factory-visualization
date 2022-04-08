import Vue from 'vue'
import VueRouter from 'vue-router'
import visualShow2 from "@/components/visualShow2";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'App',
    component: visualShow2
  },
  // {
  //   path: '/visual-show',
  //   name: 'visualShow',
  //   component: visualShow
  // },
  // {
  //   path: '/visual-show2',
  //   name: 'visualShow2',
  //   component: visualShow2
  // },
  // {
  //   path: '/visual-show3',
  //   name: 'visualShow3',
  //   component: visualShow3
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
