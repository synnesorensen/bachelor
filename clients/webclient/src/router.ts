import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import {store} from './store';

Vue.use(VueRouter);

const routes = [
    {
        path: "/welcome",
        name: "welcome",
        component: () => import ("./views/Welcome.vue")
    },
    {
        path: "/user",
        name: "user",
        component: () => import ("./views/Users.vue")
    },
    {
        path: "/register",
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
        component: () => import ("./views/Admin.vue")
    },
    {   path: '*',
        redirect: '/welcome' }
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