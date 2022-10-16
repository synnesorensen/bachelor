<template>
  <v-card>
    <v-card-title class="headline">Registrer konto</v-card-title>
    <v-card-text>
      <v-text-field 
        label="Fyll inn epost-adresse" 
        required v-model="username"
        autofocus  
      >
      </v-text-field>
      <v-text-field
        v-if="!showCodeVerification"
        label="Velg et passord"
        required
        v-model="password1"
        type="password"
        :rules="[checkPassword]"
      >
      </v-text-field>
      <v-text-field
        v-if="!showCodeVerification"
        label="Gjenta passord"
        required
        v-model="password2"
        type="password"
        :rules="[checkEqual]"
        @keyup.enter="register"
      >
      </v-text-field>
      <p style="color: red">{{ errorMsg1 }}</p>
      <v-text-field
        v-if="showCodeVerification"
        label="Fyll inn kode fra epost"
        required
        v-model="code"
        :rules="[check3]"
        @keyup.enter="verifyCode"
      >
      </v-text-field>
      <p style="color: red">{{ errorMsg2 }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="cancel"> Avbryt </v-btn>
      <v-btn
        v-if="!showCodeVerification"
        color="success"
        @click="register"
        :disabled="check1()"
      >
        Registrer
      </v-btn>
      <v-btn v-else color="success" @click="verifyCode" :disabled="check2()">
        Verifiser
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./auth";

@Component
export default class TabRegister extends Vue {
  private username = "";
  private password1 = "";
  private password2 = "";
  private code = "";
  private errorMsg1 = "";
  private errorMsg2 = "";
  private showCodeVerification = false;
  private Auth = getAuth();

  // Rules:
  checkPassword(pass1: string) {
    return pass1.length >= 8 || "Passord må være minst 8 bokstaver";
  }
  checkEqual(pass2: string) {
    return pass2 === this.password1 || "Passordene er ikke like";
  }

  check1() {
    return this.password1 != this.password2;
  }

  check2() {
    return this.code == "";
  }

  check3() {
    return this.code.length === 6 || "Legg inn 6-sifret kode fra epost";
  }

  async register() {
    let params = {
      username: this.username.toLowerCase(),
      password: this.password2,
    };
    try {
      this.errorMsg1 = "";
      let signUp = await this.Auth.signUp(params);
      this.showCodeVerification = true;
    } catch (err) {
      if (err instanceof Error) {
        this.errorMsg1 = err.message;
      }
      this.showCodeVerification = true;  
    }
  }
  async verifyCode() {
    try {
      this.errorMsg1 = "";
      this.$emit("showSpinner", true);
      let confirmedSignUp = await this.Auth.confirmSignUp(
        this.username.toLowerCase(),
        this.code
      );
      if (confirmedSignUp === "SUCCESS") {
        let signedInUser = await this.Auth.signIn(
          this.username.toLowerCase(),
          this.password2
        );
        this.$emit("loggedIn", signedInUser.signInUserSession.idToken.jwtToken);
        this.$emit("showSpinner", false);
      }
    } catch (err) {
      if (err instanceof Error) {
        this.errorMsg2 = err.message;
      }
      this.$emit("showSpinner", false);
    }
  }

  cancel() {
    this.$emit("closeDialog", true);
  }
}
</script>