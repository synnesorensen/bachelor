<template>
    <v-container fluid>
        <v-row justify="center" dense>
        <v-col :xl="6" :lg="8">
            <v-card>
                <v-img
                    src="..\..\assets\smorblomst_crop1.jpg"
                    gradient="to top right, rgba(80,115,80,1), rgba(25,32,25,0)"
                    required
                    class="white--text align-end"
                    height="40%"
                >
                    <v-card-title class="headline">Velkommen til Lunsj på hjul</v-card-title>
                </v-img>
                <v-card-text>Her kan kunder som allerede er registrerte logge seg inn. <br /> 
                Nye kunder kan registrere seg ved å trykke på knappen Registrer. 
                </v-card-text>
                <v-card-actions>
                    <v-btn 
                        color="orange"
                        text
                        @click="showLogInBox = true" 
                        class="mx-2"
                    >
                        Logg inn
                    </v-btn>
                    <v-btn 
                        color="orange"
                        text
                        @click="showRegisterBox = true" 
                        class="mx-2"
                    >
                        Registrer
                    </v-btn>
                    <LoginDialog @closeDialog="closeDialog" @loggedIn="loggedIn" :showDialog="showLogInBox" />
                    <RegisterDialog @closeDialog="closeDialog" @loggedIn="loggedIn" :showDialog="showRegisterBox" />
                </v-card-actions>
            </v-card>
        </v-col>
        </v-row>
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

    closeDialog() {
        this.showLogInBox = false;
        this.showRegisterBox = false;
    }
};
</script>