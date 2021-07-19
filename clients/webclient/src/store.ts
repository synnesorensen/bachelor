import Vue from 'vue';
import Vuex from 'vuex';
import {Userprofile, Vendor, VendorSubscription} from '../../../server/src/interfaces'
import api from '../src/api/api';
import router from './router';
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt';
import getAuth from './components/LoginDialog/auth';

Vue.use(Vuex);
interface State {
    userprofile: Userprofile | null,
    subscription: VendorSubscription | null,
    username: string, 
    vendor: Vendor | null
}

let state: State = {
    userprofile: null,
    subscription: null,
    username: "",
    vendor: null
}

export const store = new Vuex.Store({
    state,
    mutations: {
        setUserprofile (state, userprofile) {
            state.userprofile = userprofile;
        },
        setSubscription(state, subscription) {
            state.subscription = subscription;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setVendor(state, vendor) {
            state.vendor = vendor;
        }
    }, 
    getters: {
        loggedInUser(state) {
            return state.username;
        },
        userprofile(state) {
            return state.userprofile;
        },
        subscription(state) {
            return state.subscription;
        }, 
        token() {
            return localStorage.getItem("token");
        }, 
        vendor(state) {
            return state.vendor;
        }
    }, 
    actions: {
        async loggedInUser(context, payload) {
            if(!payload.jwt) {
                return;
            }
            localStorage.setItem("token", payload.jwt);
            api.setApiBearerToken(payload.jwt);
            const username = getUserInfo(payload.jwt);
            context.commit("setUsername", username);
            const vendor = api.getSingleVendor();
            context.commit("setVendor", vendor);

            const userprofile = await api.getUserprofile();
            if (!userprofile) {
                router.push({name: 'register'});
            } else {
                context.commit("setUserprofile", userprofile);
                const subscription = await api.getSingleSubscription();
                context.commit("setSubscription", subscription);
            
                if (userprofile?.isVendor) {
                    router.push({name: 'adminCalendar'});
                } else {
                    router.push({name: 'userCalendar'});
                }
                payload.callback();
            }
        },
        async logout(context) {
            const Auth = getAuth();
            Auth.signOut();
            localStorage.removeItem("token");
            api.setApiBearerToken("");
            context.commit("setUserprofile", null);
            context.commit("setSubscription", null);
            context.commit("setUsername", "");
            router.push({name: 'welcome'});
        }
    }
});

