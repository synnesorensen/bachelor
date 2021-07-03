<template>
    <v-container>
        <h1>Velkommen til oss</h1>
        <p>Er du eksisterende kunde, trykk på logg inn-knappen. 
            Ønsker du å bli kunde, trykk på register-knappen.
        </p>
        <v-btn @click="showLogInBox = true">Logg inn</v-btn>
        <v-btn @click="showRegisterBox = true">Registrer meg</v-btn>
        <LoginDialog @loggedIn="loggedIn" :showDialog="showLogInBox" />
        <RegisterDialog @loggedIn="loggedIn" :showDialog="showRegisterBox" />
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from '../components/LoginDialog/LoginDialog.vue';
import RegisterDialog from '../components/LoginDialog/RegisterDialog.vue';

@Component({
	components: {
		LoginDialog,
        RegisterDialog
	}
})

export default class Welcome extends Vue{
    private showLogInBox = false;
    private showRegisterBox = false;

    loggedIn(jwt: string) {
        const self = this;
        this.$store.dispatch("loggedInUser", {
            jwt, 
            callback: () => {
                self.showLogInBox = false;
                self.showRegisterBox = false;
        }});
    }
};
</script>