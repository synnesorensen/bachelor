import Vue from 'vue';
import Vuex from 'vuex';
import {Userprofile, VendorSubscription} from '../../../server/src/interfaces'
import api from '../src/api/api';
import router from './router';
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt';
import getAuth from './components/LoginDialog/auth';

Vue.use(Vuex);
interface State {
    userprofile: Userprofile | null,
    subscription: VendorSubscription | null,
    username: string
}

let state: State = {
    userprofile: null,
    subscription: null,
    username: ""
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
        }
    }, 
    actions: {
        async loggedInUser(context, payload) {
            localStorage.setItem("token", payload.jwt);
            api.setApiBearerToken(payload.jwt);
            const userprofile = await api.getUserprofile();
            context.commit("setUserprofile", userprofile);
            const subscription = await api.getSingleSubscription();
            context.commit("setSubscription", subscription);
            const username = getUserInfo(payload.jwt);
            context.commit("setUsername", username);
            if (userprofile?.isVendor) {
                router.push({name: 'admin'});
            } else {
                router.push({name: 'user'});
            }
            payload.callback();
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

