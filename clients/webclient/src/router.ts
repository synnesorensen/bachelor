import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { store } from './store';
import CustomerLists from "./components/Admin/CustomerLists.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/welcome",
    name: "welcome",
    component: () => import("./views/Welcome.vue")
  },
  {
    path: "/user",
    name: "user",
    component: () => import("./views/Users.vue"),
    children: [
      {
        path: 'profile',
        name: 'userProfile',
        component: () => import("./components/Users/Profile.vue")
      },
      {
        path: 'calendar',
        name: 'userCalendar',
        component: () => import("./components/Users/UserCalendar.vue")
      },
      {
        path: 'orderHistory',
        name: 'orderHistory',
        component: () => import("./components/Users/OrderHistory.vue")
      },
      {
        path: 'info',
        name: 'info',
        component: () => import("./components/Users/Information.vue")
      }
    ]
  },
  {
    path: "/registrer",
    name: "register",
    component: () => import("./views/RegisterAccount.vue")
  },
  {
    path: "/admin",
    name: "admin",
    beforeEnter: (to: Route, from: Route, next: Function) => {
      if (to.name == 'admin' && !store.getters.userprofile.isVendor) {
        next({ name: 'welcome' });
      } else {
        next();
      }
    },
    component: () => import("./views/Admin.vue"),
    children: [
      {
        path: 'profile',
        name: 'adminProfile',
        component: () => import("./components/Admin/Profile.vue")
      },
      {
        path: 'calendar',
        name: 'adminCalendar',
        component: () => import("./components/Admin/AdminCalendar.vue")
      },
      {
        path: 'delivery-list',
        name: 'deliveryList',
        component: () => import("./components/Admin/Deliveries.vue")
      },
      {
        path: 'subscriptions',
        name: 'subscriptions',
        component: () => import("./components/Admin/Subscriptions.vue")
      },
      {
        path: 'single-buy',
        name: 'single-buy',
        component: () => import("./components/Admin/SingleBuy.vue")
      },
      {
        path: 'new-customers',
        name: 'new-customers',
        component: CustomerLists,
        props: { typeOfUsersToShow: "unapproved" }
      },
      {
        path: 'sub-customers',
        name: 'sub-customers',
        component: CustomerLists,
        props: { typeOfUsersToShow: "withSubscription" }
      },
      {
        path: 'single-customers',
        name: 'single-customers',
        component: CustomerLists,
        props: { typeOfUsersToShow: "withoutSubscription" }
      },
      {
        path: 'declined-customers',
        name: 'declined-customers',
        component: CustomerLists,
        props: { typeOfUsersToShow: "declined" }
      },
    ]
  },
  {
    path: '*',
    redirect: '/welcome'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/velkommen') {
    next();
  } else if (!store.getters.token) {
    next({ name: 'welcome' });
  } else {
    next();
  } 
});

export default router;