<template>
  <v-card>
    <v-card-title class="headline">Logg inn til din konto</v-card-title>
    <v-card-text>
      <p>Vennligst oppgi brukernavn og passord</p>
      <v-text-field v-model="username" label="Brukernavn" required>
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
      let signedInUser = await Auth.signIn(this.username, this.password);
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
</script>
