<template>
  <v-container
    class="overflow-hidden"
    v-if="$store.getters.userprofile && $store.getters.userprofile.isVendor"
  >
    <v-app-bar dark app src="../assets/smorblomst_crop1.jpg">
      <v-app-bar-nav-icon
        @click="drawer = true"
        class="d-flex d-sm-none"
      ></v-app-bar-nav-icon>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          required
        >
        </v-img>
      </template>
      <template v-slot:extension>
        <v-tabs align-with-title class="d-none d-sm-flex">
          <v-tab class="ml-4" to="/admin/calendar">Kalender</v-tab>
          <v-tab to="/admin/delivery-list">Leveringsliste</v-tab>
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
                  Kunder
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
          <v-list-item to="/admin/calendar">
            <v-list-item-title>
              Kalender
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/profile">
            <v-list-item-title>
              Profil
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/delivery-list">
            <v-list-item-title>
              Leveringsliste
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/subscriptions">
            <v-list-item-title>
              Abonnenter
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/single-buy">
            <v-badge
              color="red"
              :value="$store.getters.newDeliveryRequests.length"
              :content="$store.getters.newDeliveryRequests.length"
            >
              <v-list-item-title>
                Enkeltkjøp
              </v-list-item-title>
            </v-badge>
          </v-list-item>
          <v-list-item to="/admin/new-customers">
            <v-badge
              color="red"
              :value="$store.getters.newUserRequests.length"
              :content="$store.getters.newUserRequests.length"
            >
              <v-list-item-title>
                Kunder til godkjenning
              </v-list-item-title>
            </v-badge>
          </v-list-item>
          <v-list-item to="/admin/sub-customers">
            <v-list-item-title>
              Kunder med abo
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/single-customers">
            <v-list-item-title>
              Kunder uten abo
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/declined-customers">
            <v-list-item-title>
              Avviste kunder
            </v-list-item-title>
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

  logout() {
    this.$store.dispatch("logout");
  }
}
</script>