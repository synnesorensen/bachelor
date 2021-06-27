import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: "/welcome",
        name: "welcome",
        component: () => import ("./views/Welcome.vue")
    },
    {
        path: "/app",
        name: "app",
        component: () => import ("./views/Appapp.vue")
    },
    {   path: '*',
        redirect: '/welcome' }
];


const router = new VueRouter({
    mode: 'history',
    routes
});
export default router;