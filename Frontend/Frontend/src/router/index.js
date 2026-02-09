import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/pages/Home.vue"
import Login from "../views/pages/Login.vue"
import SingleItem from "../views/pages/SingleItem.vue"
import NotFound from "../views/pages/NotFound.vue"
import { auth } from "../views/auth"
import Logout from "../views/pages/Logout.vue"
import MyItems from "../views/pages/MyItems.vue"
import Register from "../views/pages/CreateAccount.vue"
import CreateItem from "../views/pages/CreateItem.vue"
import Account from "@/views/pages/Account.vue"
import MyBids from "@/views/pages/MyBids.vue"
import SoldItems from "@/views/pages/SoldItems.vue"
import WonBids from "@/views/pages/WonBids.vue"
import Bids from "@/views/pages/Bids.vue"
import AboutUs from "@/views/pages/AboutUs.vue"
import ContactUs from "@/views/pages/ContactUs.vue"
import PrivacyPolicy from "@/views/pages/PrivacyPolicy.vue"

const routes = [
  {
    path: "/",
    component: Home   
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  {
    path: "/logout",
    component: Logout
  },
  {
    path: "/item/:id",
    component: SingleItem,
    
  },
  {
    path: "/my-items",
    component: MyItems,
    meta: { requiresAuth: true }
  },
  {
    path: "/create",
    component: CreateItem,
    meta: { requiresAuth: true }
  },
  {
    path: "/account",
    component: Account,
    meta: { requiresAuth: true }
  },
  {
    path: "/my-bids",
    component: MyBids
  },
  {
    path: "/sold-items",
    component: SoldItems
  },
  {
    path: "/won-items",
    component: WonBids
  },
  {
    path: "/auctions",
    component: Bids
  },
  {
    path: "/about",
    component: AboutUs
  },
  {
    path: "/contact",
    component: ContactUs
  },
  {
    path: "/privacy-policy",
    component: PrivacyPolicy
  },
  { path: "/:pathMatch(.*)*", component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login")
  } else {
    next()
  }
})

export default router