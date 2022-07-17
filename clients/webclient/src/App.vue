<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./components/LoginDialog/auth";

@Component({
  components: {},
})
export default class App extends Vue {
  async mounted() {
    try {
      let Auth = getAuth();
      let jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
      this.$store.dispatch("loggedInUser", {
        jwt: jwtToken,
        callback: () => {},
      });
    } catch (err) {
      this.$router.push({ name: "welcome" });
    }

    // const token = localStorage.getItem("token");
    // if (token == null || token == "undefined") {
    //   this.$router.push({ name: "welcome" });
    // } else {
    //   this.$store.dispatch("loggedInUser", {
    //     jwt: token,
    //     callback: () => {},
    //   });
    // }
  }
}
</script>
