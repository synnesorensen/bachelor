<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <v-btn @click="openBox()">Åpne dialogboks</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-dialog v-model="showDialog" persistent max-width="500">
                <v-card>
                    <v-tabs v-model="tab" align-with-title>
                        <v-tab>Logg inn</v-tab>
                        <v-tab>Registrer deg</v-tab>
                        <v-tab>Glemt passord</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
				        <v-tab-item :transition="false" :reverse-transition="false"><UserLogin /></v-tab-item>
				        <v-tab-item :transition="false" :reverse-transition="false"><RegisterUser /></v-tab-item>
			    	    <v-tab-item :transition="false" :reverse-transition="false"><ForgottenPassword /></v-tab-item>
			        </v-tabs-items>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserLogin from "./UserLogin.vue"
import RegisterUser from "./RegisterUser.vue"
import ForgottenPassword from "./ForgottenPassword.vue"

@Component({
	components: {
        UserLogin,
		RegisterUser,
        ForgottenPassword
	},
})

export default class LoginDialog extends Vue {
    private showDialog = false;
    private tab = 0;

    openBox() {
        this.showDialog = true;
    }
}
</script>