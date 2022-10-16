<template>
  <v-card>
    <v-card-title class="headline">Logg inn til din konto</v-card-title>
    <v-card-text>
      <p>Vennligst oppgi brukernavn og passord</p>
      <v-text-field 
        v-model="username" 
        label="Brukernavn" 
        required
        autofocus
      >
      </v-text-field>
      <v-text-field
        v-model="password"
        label="Passord"
        required
        type="password"
        @keyup.enter="login"
      >
      </v-text-field>
      <p style="color: red">
        {{ errorMsg }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="cancel"> Avbryt </v-btn>
      <v-btn color="success" @click="login"> Logg inn </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./auth";

@Component
export default class TabLogin extends Vue {
  private username = "";
  private password = "";
  private errorMsg = "";

  async login() {
    const Auth = getAuth();
    try {
      this.errorMsg = "";
      this.$emit("showSpinner", true);
      let signedInUser = await Auth.signIn(converteUsername(this.username), this.password);
      this.$emit("loggedIn", signedInUser.signInUserSession.idToken.jwtToken);
      this.$emit("showSpinner", false);
    } catch (err) {
      this.errorMsg = "Feil brukernavn eller passord.";
      this.$emit("showSpinner", false);
    }
  }

  cancel() {
    this.$emit("closeDialog", true);
  }
}
export function converteUsername(username: string) {
  if (username.toLowerCase() === "bgramstad@gmail.com") return "Bgramstad@gmail.com";
  if (username.toLowerCase() === "annalenajammer@gmail.com") return "Annalenajammer@gmail.com";
  if (username.toLowerCase() === "judith.dalsgard@gmail.com") return "Judith.dalsgard@gmail.com"; 
  if (username.toLowerCase() === "stineo@gmail.com") return "Stineo@gmail.com";
  if (username.toLowerCase() === "synnescool+test9@gmail.com") return "SYNNEScool+Test9@gmail.com";
  return username.toLowerCase();
}
</script>
