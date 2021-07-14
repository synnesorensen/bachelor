import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import {store} from './store';

Vue.use(VueRouter);

const routes = [
    {
        path: "/velkommen",
        name: "welcome",
        component: () => import ("./views/Welcome.vue")
    },
    {
        path: "/user",
        name: "user",
        component: () => import ("./views/Users.vue"),
        children: [
            {
              path: 'profil',
              name: 'userProfile',
              component: () => import ("./components/Users/Profile.vue")
            },
            {
                path: 'kalender',
                name: 'userCalendar',
                component: () => import ("./components/Users/UserCalendar.vue")
            },
            {
                path: 'faktura',
                name: 'invoice',
                component: () => import ("./components/Users/Invoice.vue")
            },
            {
                path: 'info',
                name: 'info',
                component: () => import ("./components/Users/Information.vue")
            }
        ]
    },
    {
        path: "/registrer",
        name: "register",
        component: () => import ("./views/RegisterAccount.vue")
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
        component: () => import ("./views/Admin.vue"),
        children: [
            {
              path: 'profil',
              name: 'adminProfile',
              component: () => import ("./components/Admin/Profile.vue")
            },
            {
                path: 'kalender',
                name: 'adminCalendar',
                component: () => import ("./components/Admin/AdminCalendar.vue")
            },
            {
                path: 'betaling',
                name: 'payments',
                component: () => import ("./components/Admin/Payments.vue")
            },
            {
                path: 'kunder',
                name: 'customers',
                component: () => import ("./components/Admin/Customers.vue")
            }
        ]
    },
    {   path: '*',
        redirect: '/velkommen' }
];


const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, _, next) => {
    if (!store.getters.token) {
        next({ name: 'welcome' });
    } else {
        next();
    } 
});



export default router;