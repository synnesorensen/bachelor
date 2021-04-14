<template>
    <v-container>
        <v-card-title class="headline">Logg inn til din konto</v-card-title>
        <v-card-text>
            <p>Vennligst oppgi brukernavn og passord</p>
            <v-text-field 
                v-model="username" 
                label="Brukernavn" 
                required
                >
            </v-text-field>
            <v-text-field 
                v-model="password" 
                label="Passord" 
                required
                type="password"
                >
            </v-text-field>
            <p 
                style="color:red;"
                >
                {{errorMsg}}
            </p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                color="success" 
                @click="login"
                >
                Logg inn
            </v-btn>
        </v-card-actions>

    </v-container>
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
            let signedInUser = await Auth.signIn(this.username, this.password);
            this.$emit("loggedIn", signedInUser.signInUserSession.idToken.jwtToken);

        } catch (err) {
            this.errorMsg = "Feil brukernavn eller passord."
        }
    }
}
</script>
