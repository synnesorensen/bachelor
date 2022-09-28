<template>
  <v-container class="overflow-hidden" v-if="$store.getters.userprofile">
    <v-app-bar color="white" app>
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="d-flex d-sm-none"
      ></v-app-bar-nav-icon>
      <template v-slot:img="{ props }">
        <v-img 
          v-bind="props" 
          required
          class="imgClass"
        />
      </template>
      <template v-slot:extension>
        <v-tabs align-with-title class="d-none d-sm-flex">
          <v-tab to="/user/calendar">Kalender</v-tab>
          <v-tab to="/user/profile">Kundeprofil</v-tab>
          <v-tab to="/user/orderHistory">Ordrehistorikk</v-tab>
          <v-tab to="/user/info">Informasjon</v-tab>
        </v-tabs>
      </template>
      <v-spacer />
      <v-btn class="d-none d-sm-flex" color="#FFDE59" @click="logout">
        Logg ut
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item
            v-for="tab in tabs"
            :key="tab.title"
            router
            :to="tab.route"
          >
            <v-list-item-title>{{ tab.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <br />
        <v-btn small text color="red" @click="logout"> Logg ut </v-btn>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserCalendar from "../components/Users/UserCalendar.vue";
import Profile from "../components/Users/Profile.vue";
import OrderHistory from "../components/Users/OrderHistory.vue";
import Information from "../components/Users/Information.vue";

@Component({
  components: {
    UserCalendar,
    Profile,
    OrderHistory,
    Information,
  },
})
export default class AppBar extends Vue {
  private drawer = false;
  private tabs = [
    {
      title: "Kalender",
      route: "/user/calendar",
    },
    {
      title: "Profil",
      route: "/user/profile",
    },
    {
      title: "Ordrehistorikk",
      route: "/user/orderHistory",
    },
    {
      title: "Informasjon",
      route: "/user/info",
    },
  ];

  logout() {
    this.$store.dispatch("logout");
  }

}
</script>

<style scoped lang="css">
  .imgClass {
    height: auto;
    width: 100%;
    background-image: url("../assets/navbar2.png");
  }
  @media screen and (min-width: 350px) {
    .imgClass {
      background-size: 100%;
      background-image: url("../assets/navbar_mobil.png");
    }
  }
  @media screen and (min-width: 1200px) {
    .imgClass {
      height: auto;
      width: 100%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 1400px) {
    .imgClass {
      height: auto;
      width: 90%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 1600px) {
    .imgClass {
      height: auto;
      width: 85%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 1800px) {
    .imgClass {
      height: auto;
      width: 80%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 2000px) {
    .imgClass {
      height: auto;
      width: 70%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 2100px) {
    .imgClass {
      height: auto;
      width: 60%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 2300px) {
    .imgClass {
      height: auto;
      width: 55%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 2600px) {
    .imgClass {
      height: auto;
      width: 50%;
      background-image: url("../assets/navbar2.png");
    }
  }
  @media screen and (min-width: 2800px) {
    .imgClass {
      height: auto;
      width: 30%;
      background-image: url("../assets/navbar2.png");
    }
  }
</style>