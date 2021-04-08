<template>
    <v-container>
        <v-card-title class="headline">Logg inn til din konto</v-card-title>
        <v-card-text>
            <p>Vennligst oppgi brukernavn og passord</p>
            <v-text-field v-model="username" label="Brukernavn" required></v-text-field>
            <v-text-field v-model="password" label="Passord" required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="login">Logg inn</v-btn>
            <v-btn color="error" @click="cancel()">Avbryt</v-btn>
        </v-card-actions>

    </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Auth from "@aws-amplify/auth";

@Component

export default class TabLogin extends Vue {
    private username = "";
    private password = "";

    cancel() {
        this.$emit("cancel");
    }

    async login() {
        const config = {
            region: "eu-north-1",
            userPoolId: "eu-north-1_T0CZQQ1dX",
            userPoolWebClientId: "4c4g5j647lbdm1kn07i54nl425",
            mandatorySignIn: true,
            authenticationFlowType: 'USER_SRP_AUTH',
        };
        
        Auth.configure(config);
        let user = await Auth.signIn(this.username, this.password);
        console.log(user);
    }

}
</script>
