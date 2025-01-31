import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt';
import getAuth from './components/LoginDialog/auth';
import { DeliveryRequestDto, SubscriptionDto, UserDto } from '../../../common/dto';
import { Userprofile, Vendor } from '../../../common/interfaces'
import api from '../src/api/api';

Vue.use(Vuex);
interface State {
  userprofile: Userprofile | null,
  subscription: SubscriptionDto | null,
  username: string,
  vendor: Vendor | null,
  newDeliveryRequests: DeliveryRequestDto[],
  newUserRequests: UserDto[]
}

let state: State = {
  userprofile: null,
  subscription: null,
  username: "",
  vendor: null,
  newDeliveryRequests: [],
  newUserRequests: []
}

export const store = new Vuex.Store({
  state,
  mutations: {
    setUserprofile(state, userprofile) {
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
    setNewDeliveryRequests(state, newDeliveryRequests) {
      state.newDeliveryRequests = newDeliveryRequests;
    },
    setNewUserRequests(state, newUserRequests) {
      state.newUserRequests = newUserRequests;
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
    newDeliveryRequests(state) {
      return state.newDeliveryRequests;
    },
    newUserRequests(state) {
      return state.newUserRequests;
    }
  },
  actions: {
    async refreshNewDeliveryRequests(context) {
      const requests = await api.getNewDeliveryRequests();
      context.commit("setNewDeliveryRequests", requests);
    },
    async refreshNewUserRequests(context) {
      const newCustomers = await api.getNewUserRequests();
      context.commit("setNewUserRequests", newCustomers);
    },
    async loggedInUser(context, payload) {
      if (!payload.jwt) {
        return;
      }
      api.setApiBearerToken(payload.jwt);
      const username = getUserInfo(payload.jwt);
      context.commit("setUsername", username);
      const vendor = await api.getVendor();
      context.commit("setVendor", vendor);

      const userprofile = await api.getUserprofile();
      if (!userprofile) {
        router.push({ name: 'register' });
      } else {
        context.commit("setUserprofile", userprofile);
        const subscription = await api.getSubscription();
        context.commit("setSubscription", subscription);

        if (payload.freshLogin) {
          if (userprofile?.isVendor) {
            router.push({ name: "adminCalendar" });
          } else {
            router.push({ name: "userCalendar" });
          }
        }
        if (userprofile?.isVendor) {
          context.dispatch("refreshNewDeliveryRequests");
          context.dispatch("refreshNewUserRequests");
          
          setInterval(() => {
            context.dispatch("refreshNewDeliveryRequests");
            context.dispatch("refreshNewUserRequests");
          }, 300000)
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
      router.push({ name: "welcome" });
    }
  }
});

