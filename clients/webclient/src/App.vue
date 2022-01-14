<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {},
})
export default class App extends Vue {
  mounted() {
    const token = localStorage.getItem("token");
    if (token == null || token == "undefined") {
      this.$router.push({ name: "welcome" });
    } else {
      this.$store.dispatch("loggedInUser", {
        jwt: token,
        callback: () => {},
      });
    }
  }
}
</script>
