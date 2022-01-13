<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile">
		<v-app-bar 
    app 
    dark
    src="..\..\assets\smorblomst_crop1.jpg"
  >
    <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-sm-none" ></v-app-bar-nav-icon>
    <template v-slot:img="{ props }">
    <v-img
      v-bind="props"
      gradient="to top right, rgba(80,115,80,1), rgba(25,32,25,0)"
      required
    >
    </v-img>
    </template>
			<v-toolbar-title>
    <div class="text-h4">
      Lunsj på Hjul
    </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-slot:extension>
    <v-tabs 
      align-with-title 
      class="d-none d-sm-flex"
    >
      <v-tab to="/user/calendar" @click="$refs.customerOverview.populateCalendar()">Kalender</v-tab>
      <v-tab to="/user/profile">Kundeprofil</v-tab>
      <v-tab to="/user/invoice">Faktura</v-tab>
      <v-tab to="/user/info">Informasjon</v-tab>
    </v-tabs>
    </template>
    <v-spacer />
    <v-btn 
    class="d-none d-sm-flex"
    color="grey" 
    @click="logout">
    Logg ut
    </v-btn>
		</v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
  >
    <v-list nav dense>
    <v-list-item-group>
      <v-list-item
      v-for="tab in tabs"
      :key="tab.title"
      router :to="tab.route"
      >
      <v-list-item-title>{{ tab.title }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
    <br />
    <v-btn 
      small
      text
      color="grey" 
      @click="logout">
      Logg ut
    </v-btn>
    </v-list>
  </v-navigation-drawer>
		<v-main>
    <router-view ref="customerOverview"></router-view>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import UserCalendar from '../components/Users/UserCalendar.vue';
import Profile from '../components/Users/Profile.vue';
import Invoice from '../components/Users/Invoice.vue';
import Information from '../components/Users/Information.vue';

@Component({
	components: {
		UserCalendar,
		Profile,
		Invoice,
  Information
	},
})
export default class AppBar extends Vue {
  private drawer = false;
  private tabs = [{
  title: "Kalender",
  route: "/user/calendar"
  },
  {
  title: "Profil",
  route: "/user/profile"
  },
  {
  title: "Faktura",
  route: "/user/invoice"
  },
  {
  title: "Informasjon",
  route: "/user/info"
  }];

  logout() {
  this.$store.dispatch("logout");
  }
}
</script>