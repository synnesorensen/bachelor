<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
        <v-toolbar-title>Lunsj på midlertidige hjul</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-tabs v-model="tab" align-with-title>
        <v-tab>Customer</v-tab>
        <v-tab>Login</v-tab>
        <v-tab>Profil</v-tab>
        <v-tab>Oversiktsside</v-tab>
        <v-tab>Faktura</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item><Customer/></v-tab-item>
        <v-tab-item>Her kommer siden for login</v-tab-item>
        <v-tab-item>Her kommer profilsiden til kunden</v-tab-item>
        <v-tab-item>Her kommer oversiktssiden med kalender</v-tab-item>
        <v-tab-item>Her kommer faktuainfo</v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Customer from './components/Customer.vue';

@Component({
  components: {
    Customer
  }
})

export default class App extends Vue {
  private tab = 0;

}
</script>