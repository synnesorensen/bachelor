import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt';
import getAuth from './components/LoginDialog/auth';
import { DeliveryRequestDto, SubscriptionDto } from '../../../common/dto';
import {Userprofile, Vendor} from '../../../common/interfaces'
import api from '../src/api/api';

Vue.use(Vuex);
interface State {
  userprofile: Userprofile | null,
  subscription: SubscriptionDto | null,
  username: string, 
  vendor: Vendor | null,
  deliveryRequests: DeliveryRequestDto[]
}

let state: State = {
  userprofile: null,
  subscription: null,
  username: "",
  vendor: null,
  deliveryRequests: []
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
    },
    setDeliveryRequests(state, deliveryRequests) {
      state.deliveryRequests = deliveryRequests;
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
    },
    deliveryRequests(state) {
      return state.deliveryRequests;
    },
    newRequests(state) {
      return (state.deliveryRequests.reduce((prev, curr) => {
        return prev + (curr.approved === "new" ? 1 : 0)
      }, 0))
    }
  }, 
  actions: {
    async refreshDeliveryRequests(context) {
      const requests = await api.getDeliveryRequests();
      context.commit("setDeliveryRequests", requests);
    },
    async loggedInUser(context, payload) {
      if(!payload.jwt) {
        return;
      }
      localStorage.setItem("token", payload.jwt);
      api.setApiBearerToken(payload.jwt);
      const username = getUserInfo(payload.jwt);
      context.commit("setUsername", username);
      const vendor = await api.getVendor();
      context.commit("setVendor", vendor);

      const userprofile = await api.getUserprofile();
      if (!userprofile) {
      router.push({name: 'register'});
      } else {
      context.commit("setUserprofile", userprofile);
      const subscription = await api.getSubscription();
      context.commit("setSubscription", subscription);
      
      if (userprofile?.isVendor) {
        context.dispatch("refreshDeliveryRequests");
        router.push({name: 'adminCalendar'});
      } else {
        router.push({name: 'userCalendar'});
      }
      payload.callback();
      }
      if (userprofile?.isVendor) {
      context.commit("setVendor", vendor);
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

