import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Account from '../views/Account.vue'
import Post from '../views/Post.vue'
import Member from '../views/Member.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/member',
    name: 'Member',
    component: Member
  },
]

const router = new VueRouter({
  routes,
  mode : 'history'
})

export default router
