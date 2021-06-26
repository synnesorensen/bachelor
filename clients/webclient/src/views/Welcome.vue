<template>
    <v-container>
        <h1>Velkommen til oss</h1>
        <p>Er du eksisterende kunde, trykk på logg inn-knappen. 
            Ønsker du å bli kunde, trykk på register-knappen.
        </p>
        <v-btn @click="showLogInBox = true">Logg inn</v-btn>
        <v-btn @click="router.push({name: 'register'})">Registrer meg</v-btn>
        <LoginDialog @loggedIn="loggedIn" :showDialog="showLogInBox" />
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from '../components/LoginDialog/LoginDialog.vue'

@Component({
	components: {
		LoginDialog
	}
})

export default class Welcome extends Vue{
    private showLogInBox = false;
    
    loggedIn(jwt: string) {
        this.$store.dispatch("loggedInUser", jwt);
        this.showLogInBox = false;
        this.$router.push({name: 'app'})
    }
};
</script>