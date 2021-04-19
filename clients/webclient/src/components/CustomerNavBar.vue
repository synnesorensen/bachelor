<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-if="!showLoginDialog" v-model="tab" align-with-title>
				<v-tab>Oversikt</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
			</v-tabs>
            <v-spacer />
            <v-btn 
                color="secondary" 
                @click="logout"
                >
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
            <LoginDialog v-if="showLoginDialog" @loggedIn="loggedIn" :showDialog="showLoginDialog" />
            <CustomerOrder 
                :loggedInUser="loggedInUser" 
                v-else-if="userprofile==null" 
                @userprofile="newUserprofile" />
			<v-tabs-items v-else v-model="tab">
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerProfile /> </v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from './LoginDialog/LoginDialog.vue';
import CustomerOverview from './CustomerOverview.vue';
import CustomerOrder from './CustomerOrder.vue';
import CustomerProfile from './CustomerProfile.vue';
import CustomerInvoice from './CustomerInvoice.vue';
import getAuth from './LoginDialog/auth';
import {setApiBearerToken, getVendorSubscriptions, getUserprofile} from '../api/api'
import * as interfaces from '../../../../server/src/interfaces'
import { getUserInfo } from '../../../../server/src/auth/getUserFromJwt'

@Component({
	components: {
		LoginDialog,
		CustomerOverview,
		CustomerOrder,
		CustomerProfile,
		CustomerInvoice,
		CustomerNavBar
	},
})
export default class CustomerNavBar extends Vue {
	private tab = 0;
    private jwtToken = "";
    private showLoginDialog = false;
    private userprofile: interfaces.Userprofile | null = null;
    private loggedInUser: string | null = null;

    mounted() {
        const token = localStorage.getItem("token");
        if (token) {
            this.loggedIn(token);
        } else {
            this.showLoginDialog = true;
        }
    }
    
    async loggedIn(jwtToken: string) {
        this.jwtToken = jwtToken;
        localStorage.setItem("token", this.jwtToken);
        setApiBearerToken(this.jwtToken);
        this.userprofile = await getUserprofile();
        this.loggedInUser = getUserInfo(this.jwtToken);
        this.showLoginDialog = false;
    }

    logout() {
        const Auth = getAuth();
        Auth.signOut();
        this.jwtToken = "";
        this.showLoginDialog = true;
        localStorage.removeItem("token");
    }

    newUserprofile(userprofile: interfaces.Userprofile) {
        this.userprofile = userprofile;
    }

}
</script>

