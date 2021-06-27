<template>
    <v-card>
        <v-card-title class="headline">Glemt passord?</v-card-title>
        <v-card-text>
            <v-text-field 
                v-if="!showVerification"
                v-model="username"
                label="Fyll inn epost-adresse" 
                required
                @keyup.enter="sendPassword"
            >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Fyll inn kode fra epost" 
                required
                v-model="code"
            >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Fyll inn nytt passord" 
                required
                v-model="password1"
                type="password"
                :rules="[checkPassword]"
            >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Gjenta nytt passord" 
                required
                v-model="password2"
                type="password"
                :rules="[checkEqual]"
                @keyup.enter="verifyPassword"
            >
            </v-text-field>
        </v-card-text>
        <p style="color:red;"> {{errorMsg}}</p>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                v-if="!showVerification"
                color="success" 
                @click="sendPassword"
            >
            Send
            </v-btn>
            <v-btn 
                v-else
                color="success" 
                @click="verifyPassword"
                :disabled = "check()"
            >
            Send
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./auth";

@Component

export default class TabPassword extends Vue {
    private username = "";
    private code = "";
    private password1 = "";
    private password2 = "";
    private Auth = getAuth();
    private showVerification = false;
    private errorMsg = "";
    
    // Rules:
    checkPassword(pass1: string) {
        return pass1.length >= 8 || "Passord må være minst 8 bokstaver";
    }
    checkEqual(pass2: string) {
        return pass2 === this.password1 || "Passordene er ikke like"
    }

    check() {
        return this.password1!=this.password2 || this.code == "";
    }

    sendPassword() {
        this.Auth.forgotPassword(this.username);
        this.showVerification = true;
    }

    async verifyPassword() {
        try {
            this.errorMsg = "";
            this.$emit("showSpinner", true);
            await this.Auth.forgotPasswordSubmit(this.username, this.code, this.password2);
            let signedInUser = await this.Auth.signIn(this.username, this.password2);
            this.$emit("loggedIn", signedInUser.signInUserSession.idToken.jwtToken);
            this.$emit("showSpinner", false);
        } catch (err) {
            this.errorMsg = err.message;
            this.$emit("showSpinner", false);
        }
    }
}
</script>