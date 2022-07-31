<template>
  <v-container
    class="overflow-hidden"
    v-if="$store.getters.userprofile && $store.getters.userprofile.isVendor"
  >
    <v-app-bar app dark src="../assets/smorblomst_crop1.jpg">
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="d-flex d-sm-none"
      ></v-app-bar-nav-icon>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(80,115,80,1), rgba(25,32,25,0)"
          required
        >
        </v-img>
      </template>
      <v-toolbar-title>
        <div class="text-h4 white--text">Lunsj på Hjul</div>
      </v-toolbar-title>
      <v-spacer />
      <template v-slot:extension>
        <v-tabs align-with-title class="d-none d-sm-flex">
          <v-tab to="/admin/calendar">Kalender</v-tab>
          <v-tab to="/admin/profile">Profil</v-tab>
          <v-tab to="/admin/subscriptions">Abonnenter</v-tab>
          <v-tab to="/admin/single-buy">
            <v-badge
              color="red"
              :value="$store.getters.newDeliveryRequests.length"
              :content="$store.getters.newDeliveryRequests.length"
            >
              Enkeltkjøp
            </v-badge>
          </v-tab>
          <v-menu fixed offset-y>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tab v-bind="attrs" v-on="menu" id="menuTab">
                <v-badge
                  color="red"
                  :value="$store.getters.newUserRequests.length"
                  :content="$store.getters.newUserRequests.length"
                >
                  Kundelister
                </v-badge>
              </v-tab>
            </template>
            <v-list>
              <v-list-item to="/admin/new-customers">
                <v-list-item-title>Til godkjenning</v-list-item-title>
              </v-list-item>
              <v-list-item to="/admin/sub-customers">
                <v-list-item-title>Kunder med abo</v-list-item-title>
              </v-list-item>
              <v-list-item to="/admin/single-customers">
                <v-list-item-title>Kunder uten abo</v-list-item-title>
              </v-list-item>
              <v-list-item to="/admin/declined-customers">
                <v-list-item-title>Avviste kunder</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tabs>
      </template>
      <v-spacer />
      <v-btn class="d-none d-sm-flex" color="amber" @click="logout">
        Logg ut
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary fixed>
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
      <router-view></router-view>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AdminCalendar from "../components/Admin/AdminCalendar.vue";
import Profile from "../components/Admin/Profile.vue";
import Payments from "../components/Admin/Subscriptions.vue";
import CustomerLists from "../components/Admin/CustomerLists.vue";

@Component({
  components: {
    AdminCalendar,
    Profile,
    Payments,
    CustomerLists,
  },
})
export default class AppBar extends Vue {
  private drawer = false;
  private tabs = [
    {
      title: "Kalender",
      route: "/admin/calendar"
    },
    {
      title: "Profil",
      route: "/admin/profile"
    },
    {
      title: "Abonnenter",
      route: "/admin/subscriptions"
    },
    {
      title: "Enkeltkjøp",
      route: "/admin/single-buy"
    },
    {
      title: "Kunder til godkjenning",
      route: "/admin/new-customers"
    },
    {
      title: "Kunder med abo",
      route: "/admin/sub-customers"
    },
    {
      title: "Kunder uten abo",
      route: "/admin/single-customers"
    },
    {
      title: "Avviste kunder",
      route: "/admin/declined-customers"
    }

  ];

  logout() {
    this.$store.dispatch("logout");
  }
}
</script>