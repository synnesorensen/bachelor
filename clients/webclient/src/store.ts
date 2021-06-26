import Vue from 'vue';
import Vuex from 'vuex';
import {Userprofile, VendorSubscription} from '../../../server/src/interfaces'
import api from '../src/api/api';
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt';

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
        getLoggedInUser(state) {
            
        }
    }, 
    actions: {
        async loggedInUser(context, jwt) {
            localStorage.setItem("token", jwt);
            api.setApiBearerToken(jwt);
            const userprofile = await api.getUserprofile();
            context.commit("setUserprofile", userprofile);
            const subscription = await api.getSingleSubscription();
            context.commit("setSubscription", subscription);
            const username = getUserInfo(jwt);
            context.commit("setUsername", username);
        }
    }
});

